import type { Env } from "../types.ts";

type DurableStorageLike = {
  setAlarm(scheduledTime: number): Promise<void>;
  deleteAll(): Promise<void>;
};

type DurableStateLike = {
  storage: DurableStorageLike;
};

// Design scaffold only. The MVP WebRTC flow does not bind or persist sessions in a Durable Object.
export class ExamSession {
  constructor(
    private readonly state: DurableStateLike,
    private readonly env: Env
  ) {}

  async fetch(): Promise<Response> {
    await this.state.storage.setAlarm(Date.now() + this.maximumSessionMilliseconds());
    return new Response("ExamSession Durable Object is not enabled in the MVP.", { status: 501 });
  }

  async alarm(): Promise<void> {
    await this.state.storage.deleteAll();
  }

  private maximumSessionMilliseconds(): number {
    const minutes = Math.min(30, Math.max(1, Number(this.env.MAX_EXAM_MINUTES) || 12));
    return minutes * 60 * 1000;
  }
}
