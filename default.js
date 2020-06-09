$(function() {
    cardChanger({
		frameSelector: "#slider",
		changeMethod: "slide",
		frameHeight: 500,
		interval: 2000
	});
});

/***********************************************************************
 * @iroSOFT
 * www.devdic.com, www.cydemy.com
 * 다음 소스코드는 반응형 웹사이트에 사용되는 배경 이미지 카드타입 전환 시스템입니다.
 * 전환 카드로 사용되는 컨테이너는 배경 이미지로 설정되어 안에 필요한 콘텐츠를 삽입할 수 있습니다.
 * 반드시 출처를 밝힌 상태에서 누구든지 사용(수정)이 가능합니다만 재배포는 안됩니다.
 * Example:
 * cardChanger({
 *		frameSelector: "#slider",
 *		changeMethod: "fade",
 *		frameHeight: 500,
 *		interval: 2000
 *  });
 * frameSelector: <stirng> cardChanger로 사용할 요소의 class or id
 * changeMethod: <stirng> 전환 방식 선택( fade | slide)
 * frameHeight: <number> cardChanger의 높이
 * interval: <number> 반복 주기 밀리초(1/1000초)
 */
function cardChanger(options) {
    var slider = options.frameSelector;
    var interval = options.interval || 2000;
    var method = options.changeMethod || "slide";
	var height = options.frameHeight;
    var aMethod = [];	
    var itemWidth;
    var itemCount = $(slider + " > div > div").length;
    var loopTimer;
	var resetTimer;
    var isAnimating;

    function _setSize() {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function() {
            itemWidth = $(slider).width();
            //console.log(itemWidth);

            $(slider + "> div").css({
                width: (itemWidth * itemCount) + "px",
                height: height + "px"
            }).children().css({
                width: itemWidth + "px",
                height: height + "px"
            });
        }, 50);
    }


    function _init() {
        // 배경 이미지 설정
        $(slider + " > div > div").each(function() {
            $(this).css("background", function() {
                var bgImg = $(this).attr("data-bg");
                return 'url("' + bgImg + '") no-repeat'
            }).css("background-size", "cover");
        });


        if (method == "slide") {
            $(slider + " > div").css({
                position: "absolute",
                left: 0,
                top: 0
            }).children().css({
                float: "left",
                position: "relative"
            }).addClass("slider-item-slide");
        } else if (method == "fade") {
            $(slider + " > div").css({
                position: "relative"
            }).children().css({
                position: "absolute",
                top: 0,
                left: 0
            }).addClass("slider-item-fade");
        }

        /* Bug fixed: 기존코드 하위의 div를 선택자로 사용하면 슬라이드 항목의 div도 해당되므로 자식으로 제한 */
        $(slider + " > div," + slider + " span").mouseover(function() {
            clearInterval(loopTimer);

        }).mouseout(function() {
            loopTimer = setInterval(aMethod[method], interval);
        });

        $(slider + " > .slider-prev").click({
            direction: "prev"
        }, aMethod[method]);

        $(slider + " > .slider-next").click({
            direction: "next"
        }, aMethod[method]);
    }

    /*********************************************************
     * 슬라이딩 효과로 처리
     */
    aMethod['slide'] = function(e) {
        // 이벤트에 의해 호출되는 경우, 애니메이션 중인 경우에는 함수 실행을 종료한다.
        if (isAnimating && e) return;

        var direction = !e ? "next" : e.data.direction;
        var operation = direction == "next" ? "-=" : "+=";
        //console.log(direction);
        if (direction == "prev") {
            $(slider + ">div > div:last-child").clone().prependTo(slider + "> div");
            $(slider + ">div").css("left", function() {
                return "-" + itemWidth + "px";
            });
        }

        // 애니메이션 중임을 변수에 정의한다.
        isAnimating = true;

        $(slider + " > div").animate({
            "left": operation + itemWidth + "px"
        }, "slow", function() {
            if (direction == "prev") {
                $(slider + ">div > div:last-child").remove();
            } else {
                $(slider + ">div > div:first-child").clone().appendTo(slider + "> div");
                $(slider + ">div > div:first-child").remove();
                $(slider + ">div").css("left", 0);
            }
            // 애니메이션이 종료되었음을 변수에 정의한다.
            isAnimating = false;
        });
    }

    /*********************************************************
     * 페이드인아웃 효과로 처리
     */
    aMethod['fade'] = function(e) {
        // 이벤트에 의해 호출되는 경우, 애니메이션 중인 경우에는 함수 실행을 종료한다.
        if (isAnimating && e) return;
		
		var toOpacity;

        var direction = !e ? "next" : e.data.direction;
        if (direction == "prev") {
            $(slider + ">div > div:first-child").clone().appendTo(slider + "> div").css("opacity", 0);
            $(slider + ">div > div:first-child").remove();
			toOpacity = 1;
        } else {
			toOpacity = 0;
		}

        // 애니메이션 중임을 변수에 정의한다.
        isAnimating = true;

        $(slider + " > div > div:last-child").animate({
            opacity: toOpacity,
        }, "slow", function() {
			if (direction == "next") {
				$(slider + ">div > div:last-child").clone().prependTo(slider + "> div").css("opacity", 1);
				$(slider + ">div > div:last-child").remove();
			}
			
            // 애니메이션이 종료되었음을 변수에 정의한다.
            isAnimating = false;
        });
    }

    /*********************************************************
     * 동작 시작
     */
    $(window).on("resize", _setSize).trigger("resize");
    _init();    

    loopTimer = setInterval(aMethod[method], interval);
}
