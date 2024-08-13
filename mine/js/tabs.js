// var 버튼 = $(".tab-button");
// var 버튼갯수 = 버튼.length;
// var 내용 = $(".tab-content");
// function rmcl(fr, cln, ad, cnt) {
//     for (var i = 0; i < cnt; i++) {
//         fr.eq(i).removeClass(cln);
//     }
//     fr.eq(ad).addClass(cln);
//     return;
// }

// for (let i = 0; i < 버튼갯수; i++) {
//     버튼.eq(i).on("click", function () {
//         rmcl(버튼, "orange", i, 버튼갯수);
//         rmcl(내용, "show", i, 버튼갯수);
//     });
// }

var 버튼 = $(".tab-button");
var 내용 = $(".tab-content");

// for (let i = 0; i < 3; i++) {
//     버튼.eq(i).on("click", function () {
//         탭열기(i);
//     });
// }

$(".list").click(function (e) {
    탭열기(e.target.dataset.id);
});

function 탭열기(숫자) {
    버튼.removeClass("orange");
    버튼.eq(숫자).addClass("orange");
    내용.removeClass("show");
    내용.eq(숫자).addClass("show");
}
