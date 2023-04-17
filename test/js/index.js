//请求数据obj ：{method:"get",url:"",data:{}};
function httpRequest(obj, successfun, errFun) {
  var xmlHttp = null;
  //创建 XMLHttpRequest 对象，老版本的 Internet Explorer （IE5 和 IE6）使用 ActiveX 对象：xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
  if (window.XMLHttpRequest) {
    //code for all new browsers
    xmlHttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    //code for IE5 and IE6
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  //判断是否支持请求
  if (xmlHttp == null) {
    alert("浏览器不支持xmlHttp");
    return;
  }
  //请求方式， 转换为大写
  var httpMethod = (obj.method || "Get").toUpperCase();
  //数据类型
  var httpDataType = obj.dataType || "json";
  //url
  var httpUrl = obj.url || "";
  //异步请求
  var async = true;
  //post请求时参数处理
  if (httpMethod == "POST") {
    //请求体中的参数 post请求参数格式为：param1=test&param2=test2
    var data = obj.data || {};
    var requestData = "";
    for (var key in data) {
      requestData = requestData + key + "=" + data[key] + "&";
    }
    if (requestData == "") {
      requestData = "";
    } else {
      requestData = requestData.subString(0, requestData.length - 1);
    }
    console.log(requestData);
  }
  //onreadystatechange 是一个事件句柄。它的值 (state_Change) 是一个函数的名称，当 XMLHttpRequest 对象的状态发生改变时，会触发此函数。状态从 0 (uninitialized) 到 4 (complete) 进行变化。仅在状态为 4 时，我们才执行代码
  xmlHttp.onreadystatechange = function () {
    //complete
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200) {
        //请求成功执行的回调函数
        successfun(xmlHttp.responseText);
      } else {
        //请求失败的回调函数
        errFun;
      }
    }
  };
  //请求接口
  if (httpMethod == "GET") {
    xmlHttp.open("GET", httpUrl, async);
    xmlHttp.send(null);
  } else if (httpMethod == "POST") {
    xmlHttp.open("POST", httpUrl, async);
    xmlHttp.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    xmlHttp.send(requestData);
  }
}
window.onload = function () {
  // 滑动函数
  function moves(obj, target, callback) {
    window.clearInterval(obj.timer);
    obj.timer = window.setInterval(function () {
      var step = (target - obj.offsetLeft) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      if (obj.offsetLeft == target) {
        window.clearInterval(obj.timer);
        if (callback) {
          callback();
        }
      } else {
        obj.style.left = obj.offsetLeft + step + "px";
      }
    }, 15);
  }
  // 移动到图片上的时候左右的箭头才显示出来 离开后又隐藏
  var focusing = document.querySelector(".focus");
  // 获取左箭头
  var arrowleft = document.querySelector(".arrow-left");
  // 获取右箭头
  var arrowright = document.querySelector(".arrow-right");
  var ul = document.querySelector(".focus_ul");
  // console.log(focusing);
  // 获得图片张数
  var len = ul.children.length;
  // 动态生成下面的小圆点
  var ol = document.querySelector("ol");
  for (var i = 0; i < len - 1; i++) {
    var newcircle = document.createElement("li");
    ol.appendChild(newcircle);
  }
  // 把ol里面的第一个li的类名设置成current
  ol.children[0].className = "current";
  // 收移动到focus的时候显示箭头
  focusing.addEventListener("mouseenter", function () {
    // 鼠标移动到图片的时候清除定时器
    window.clearInterval(timer);
    timer = null;
    arrowleft.style.display = "block";
    arrowright.style.display = "block";
  });
  // 鼠标离开又隐藏
  focusing.addEventListener("mouseleave", function () {
    // 鼠标离开又重新设置定时器
    // 自动播放轮播图
    timer = window.setInterval(function () {
      // 手动调用点击事件
      arrowright.click();
    }, 2000);
    arrowleft.style.display = "none";
    arrowright.style.display = "none";
  });
  // 给每个小圆点设置自定义属性
  for (var i = 0; i < len - 1; i++) {
    ol.children[i].setAttribute("index", i);
  }
  // 点击哪个小圆圈哪个小圆圈就变色 -排他思想
  for (var i = 0; i < len - 1; i++) {
    ol.children[i].addEventListener("click", function () {
      for (var j = 0; j < len - 1; j++) {
        ol.children[j].className = "";
      }
      // 点击第几个小圆点ul就移动小圆点坐标乘以图片宽度
      // alert(-(this.getAttribute('index') * ul.children[0].offsetWidth));
      moves(ul, -this.getAttribute("index") * ul.children[0].offsetWidth);
      num = this.getAttribute("index");
      circle = this.getAttribute("index");
      this.className = "current";
      // ul.style.left = "-720px";
    });
  }
  // 点击右边箭头 设置一个num进行移动距离
  var num = 0;
  // 点击右边的箭头小圆圈也变色
  var circle = 0;
  function arrowrightOnClick() {
    if (num == len - 1) {
      ul.style.left = 0;
      num = 0;
      circle = 0;
    }
    num++;
    moves(ul, -num * ul.children[0].offsetWidth);
    circle++;
    for (var i = 0; i < len - 1; i++) {
      ol.children[i].className = "";
    }
    // 在加到最后一张重复图片的时候就把第一个圆点变色
    if (circle == len - 1) {
      // alert('haha')
      ol.children[0].className = "current";
    }
    ol.children[circle].className = "current";
  }
  arrowright.addEventListener("click", arrowrightOnClick);
  // 点击左边箭头
  function arrowleftOnClick() {
    if (num == 0) {
      num = len - 1;
      ul.style.left = -num * ul.children[0].offsetWidth;
      circle = len - 1;
    }
    num--;
    moves(ul, -num * ul.children[0].offsetWidth);
    circle--;
    for (var i = 0; i < len - 1; i++) {
      ol.children[i].className = "";
    }
    // 在减到最后一张重复图片的时候就把第一个圆点变色
    if (circle == 0) {
      // alert('haha')
      ol.children[0].className = "current";
    }
    ol.children[circle].className = "current";
  }
  arrowleft.addEventListener("click", arrowleftOnClick);
  // 自动播放轮播图
  var timer = window.setInterval(function () {
    // 手动调用点击事件
    arrowright.click();
  }, 2000);
  //曲线图数据展示
  //获取数据
  var chart_data = { xAxis: [], series: [] };
  httpRequest(
    {
      method: "get",
      url: "https://edu.telking.com/api/?type=month",
      // data: {
      //   param1: "",
      // },
    },
    function (res) {
      //console.log("echart数据：", typeof res); //string
      chart_data = JSON.parse(res);
      console.log("echart数据：", chart_data);
      var dom = document.getElementById("curve_chart");
      var myChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      var app = {};

      var option;
      // console.log("chart_data.xAxis", typeof chart_data.xAxis);
      option = {
        title: {
          text: "曲线图数据展示",
          left: "center",
        },
        xAxis: {
          type: "category",
          // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: chart_data.data.xAxis,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 人",
          },
        },
        series: [
          {
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            data: chart_data.data.series,
            type: "line",
            smooth: true,
            label: {
              show: true,
              position: "top",
              textStyle: {
                fontSize: 12,
              },
            },
          },
        ],
      };

      if (option && typeof option === "object") {
        myChart.setOption(option);
      }

      window.addEventListener("resize", myChart.resize);
    },
    function () {
      console.log("请求失败");
    }
  );

  //饼状图
  var dom = document.getElementById("pie_chart");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  var app = {};

  var option;

  option = {
    title: {
      text: "饼状图数据展示",
      // subtext: "Fake Data",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    // legend: {
    //   orient: "vertical",
    //   left: "left",
    // },
    series: [
      {
        // name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          { value: 100, name: "Mon" },
          { value: 100, name: "Tue" },
          { value: 100, name: "Web" },
          { value: 50, name: "Thu" },
          { value: 600, name: "Fri" },
          { value: 400, name: "Sat" },
          { value: 500, name: "Sun" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);

  //柱状图
  dom = document.getElementById("columnar_chart");
  myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  // var app = {};

  // var option;

  option = {
    title: {
      text: "柱状图数据展示",
      left: "center",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
      name: "商品数",
    },
    series: [
      {
        data: [9, 10, 13, 10, 8, 11, 5],
        type: "bar",
        barWidth: 14,
        itemStyle: {
          color: "#4587ef",
        },
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
};
