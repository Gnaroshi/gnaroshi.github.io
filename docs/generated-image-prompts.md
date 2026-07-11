# Generated Image Prompts

Only the Home Hero and the VLA research scene use image generation in this rebuild. All outputs are candidates, not approved production assets.

## Home Hero Base Prompt

> A detailed but clean editorial illustration of an AI research workspace in a university laboratory. A compact tabletop robot arm is manipulating a clearly visible red cube. An overhead RGB camera observes the workspace. Beside it is an open printed machine-learning paper with diagrams and highlighted sections, a notebook with handwritten marks that are not readable, and a laptop showing a simple image-to-action experiment interface with visual panels but no readable text. A pair of human hands is taking notes and adjusting the experiment, but no face or identifiable person is visible. Realistic materials, believable robotics hardware, organized cables, a small calibration board, warm natural daylight, neutral off-white and charcoal palette with muted forest green and blue accents. Rich enough to feel like a real working research environment, but carefully organized with one clear focal point: the robot completing the task. High-end editorial digital illustration, slightly stylized realism, not a photograph, not an infographic, not miniature 3D, not toy-like, not cyberpunk, no neon, no floating objects, no fake code, no logos, no readable text, no humanoid robot, no excessive clutter.

Aspect ratio: 5:4. Target source: at least 2000 × 1600.

- `home-hero-a`: three-quarter desk view; robot central; paper and laptop support the action.
- `home-hero-b`: slight overhead view; paper, laptop, camera, and task form one workflow.
- `home-hero-c`: closer experiment view; robot and cube dominate; hands and paper frame the action.

The built-in generator returned 1402 × 1122 originals. `npm run media:build` creates 2000 × 1600 review sources with Lanczos resampling; this dimension normalization does not count as semantic approval.

## VLA Base Prompt

> A clear editorial illustration of a vision-language-action robotics experiment. A compact six-axis tabletop robot arm reaches toward three distinct objects: a red cube, a blue cylinder, and a yellow block. An overhead camera observes the table. A small nearby display presents a simple speech-bubble symbol and a highlighted target object without readable words, suggesting a language instruction. The robot gripper is moving toward the correct red cube. Include a subtle action trajectory and a small calibration marker. The complete scene must immediately read as: camera observation plus language instruction leading to robot action. Realistic and mechanically believable hardware, clean university lab setting, warm neutral colors with muted green and blue accents, detailed enough to be informative but uncluttered. No humanoid robot, no robot face, no floating blocks, no abstract network nodes, no text, no labels, no generic AI glow, no toy-like plastic style, no cyberpunk.

Aspect ratio: 4:3.

- `research-vla-a`: front three-quarter experiment view.
- `research-vla-b`: overhead experiment view.
- `research-vla-c`: close view emphasizing camera, instruction display, target, and gripper.

## Permanent Negative Constraints

No readable generated text, fake code, logos, faces, humanoid robots, abstract node clouds, floating blocks, translucent planes, neon, cyberpunk, toy dioramas, unrelated props, or watermarks.
