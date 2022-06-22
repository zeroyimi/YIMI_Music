window.onload = function () {
  let search = document.querySelector("#search");
  let audio = document.querySelector("audio");
  let list = document.querySelector("#list");
  let textObj = document.querySelector("#text");
  let title = document.querySelector("#title");
  let singer = document.querySelector("#singer");
  let Img = document.querySelector("#Img img");
  // 设置音量拖动区域---------------------------
  let voice = document.querySelector("#voice");
  let vImg = document.querySelector("#voice img");
  let cdiv = document.querySelector("#cdiv");
  let mode = voice.querySelector("#mode");
  let mdiv = voice.querySelector("#mdiv");
  let move = voice.querySelector("#mode .move");
  let circle = voice.querySelector("div span");
  modeLength = parseInt(mode.offsetWidth).toFixed(2);
  let line = 0;

  // 进度条相关的内容
  let mMode = document.querySelector("#mmode");
  let mMove = mMode.querySelector(".mmove");
  let sImg = document.querySelector("#sImg");
  let mMoveWidth = parseInt(mMove.offsetWidth);
  let mModeWidth = parseInt(mMode.offsetWidth);
  let duanLength;
  let Length;
  let wordHeight;
  let texts;

  let tImg = document.querySelector("#Img img");
  let bgImg = document.querySelector(".box-right>img");
  let hImg = document.querySelector("#hImg");

  // 上一首歌
  let prev = document.querySelector("#prev");
  // 下一首歌
  let next = document.querySelector("#next");

  let myArr = [];
  let hotArr = [];
  let searchArr = [];
  let medisArr = [];

  // 建立ajax链接，相关添加歌词操作在这里面进行
  let xhr = new XMLHttpRequest();
  xhr.open("get", "http://www.coderyq.cn:3000/personalized/newsong");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
      let rep = eval("(" + xhr.responseText + ")");
      // 获取热门五十首并添加到歌单---------------------------
      for (let i = 0; i < rep.result.length; i++) {
        hotArr.push({
          id: rep.result[i].id,
          mvid: rep.result[i].song.mvid,
          song: rep.result[i].name,
          artist: rep.result[i].song.album.artists[0].name,
          album: rep.result[i].song.album.name,
          albumImg: rep.result[i].picUrl,
          bgImg: rep.result[i].song.album.blurPicUrl,
        });
      }

      hotfun();
      let lis = document.querySelectorAll("#list>li");

      lis[0].className = "active";
      let query = rep.result[0].id;
      let mvid = rep.result[0].song.mvid;
      write(query, mvid, 0, hotArr);

      // let point = 0
      prev.onclick = function () {
        if (cycle.querySelector("img").title == "循环播放") {
          if (point == 0) {
            point = lis.length - 1;
          } else {
            point--;
          }
        } else if (cycle.querySelector("img").title == "顺序播放") {
          if (point == 0) {
            point = 0;
            alert("已经是第一首歌");
          } else {
            point--;
          }
        } else if (cycle.querySelector("img").title == "随机播放") {
          random();
        }
        for (let i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        lis[point].className = "change";

        audio.src =
          "http://music.163.com/song/media/outer/url?id=" +
          hotArr[point].id +
          ".mp3";
        title.innerHTML = hotArr[point].song;
        singer.innerHTML = hotArr[point].artist;
        tImg.src = hotArr[point].albumImg;
        bgImg.src = hotArr[point].bgImg;
        hImg.src = hotArr[point].albumImg;

        for (let i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        lis[point].className = "active";
        let query = rep.result[point].id;
        let mvid = rep.result[point].mvid;
        write(query, mvid, point, hotArr);
      };

      next.onclick = function () {
        // 判断播放条件
        if (cycle.querySelector("img").title == "循环播放") {
          if (point == lis.length - 1) {
            point = 0;
          } else {
            point++;
          }
        } else if (cycle.querySelector("img").title == "顺序播放") {
          if (point == lis.length - 1) {
            point = lis.length - 1;
            alert("已经是最后一首歌");
          } else {
            point++;
          }
        } else if (cycle.querySelector("img").title == "随机播放") {
          random();
        }

        for (let i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        lis[point].className = "change";

        audio.src =
          "http://music.163.com/song/media/outer/url?id=" +
          hotArr[point].id +
          ".mp3";
        title.innerHTML = hotArr[point].song;
        singer.innerHTML = hotArr[point].artist;
        tImg.src = hotArr[point].albumImg;
        bgImg.src = hotArr[point].bgImg;
        hImg.src = hotArr[point].albumImg;

        for (let i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        lis[point].className = "active";
        let query = rep.result[point].id;
        let mvid = rep.result[point].mvid;
        write(query, mvid, point, hotArr);
      };

      let hot = document.querySelector("#hot");
      hot.addEventListener("click", hotfun);

      // 点击收藏
      hotlove(rep);

      // 点击出现歌词
      //  "http://www.coderyq.cn:3000/lyric?id=" 获取歌词
      for (let i = 0; i < lis.length; i++) {
        lis[i].onclick = function () {
          let query = rep.result[i].id;
          let mvid = rep.result[i].mvid;
          write(query, mvid, i, hotArr);
        };
      }

      // 歌曲进度条拖动
      // 点击图片mousedown 移动body mousempove 释放body mouseup
      mMode.onmousedown = function (e) {
        texts = textObj.children;
        sImg.style.transition = "0s";
        // 点击之后，获取当前进度条的长度，时间播放调整的相应长度，歌词播放改变line值
        // 解决点击后时间继续改变问题
        duanLength = Number(
          (e.pageX - mMode.getBoundingClientRect().left).toFixed(2)
        );
        mMove.style.left = duanLength - 1200 + "px";
        sImg.style.left = duanLength - 15 + "px";
        // 点击后获取当前时间
        audio.currentTime = (
          (duanLength / mModeWidth) *
          audio.duration
        ).toFixed(3); // 计算没错
        for (let i = 0; i < medisArr.length; i++) {
          if (
            Number(medisArr[i].t) <= audio.currentTime &&
            Number(medisArr[i + 1].t) >= audio.currentTime
          ) {
            line = i;
            break;
          }
        }
        lineHeight(line);
        document.body.onmousemove = function (e) {
          duanLength = Number(
            (e.pageX - mMode.getBoundingClientRect().left).toFixed(2)
          );
          mMove.style.left = duanLength - mMoveWidth + "px";
          sImg.style.left = duanLength - 15 + "px";
          // 点击后获取当前时间
          audio.currentTime = (
            (duanLength / mModeWidth) *
            audio.duration
          ).toFixed(3); // 计算没错
          for (let i = 0; i < medisArr.length; i++) {
            if (
              Number(medisArr[i].t) <= audio.currentTime &&
              Number(medisArr[i + 1].t) >= audio.currentTime
            ) {
              line = i;
              break;
            }
          }
          lineHeight(line);
          document.body.onmouseup = function (e) {
            // 松开的时候记住距离Left的距离以及对于的播放时间
            document.body.onmousemove = null;
          };

          // if(e.pageX<=)
        };
      };
      // rep if 里面的内容结束
    }
  };

  // 存储hot热门歌曲数据的函数
  function hotfun() {
    hot.style.background = "#476644";
    hot.style.color = "#fff";
    menu.style.background = "";
    menu.style.color = "#86a074";
    list.innerHTML = "";
    for (let i = 0; i < hotArr.length; i++) {
      let li = document.createElement("li");
      let ul = document.createElement("ul");

      let liName = document.createElement("li");
      liName.innerHTML = hotArr[i].song;

      let liSing = document.createElement("li");
      liSing.innerHTML = hotArr[i].artist;

      let liTime = document.createElement("li");
      liTime.innerHTML = hotArr[i].album;
      let liB = document.createElement("li");
      // 添加新的列表
      // 为空时所有都设置为不收藏状态
      liB.innerHTML = '<img src="./img/icon/no.svg" class="yes">';

      let id = hotArr.id;
      if (nums.length !== 0) {
        for (let i = 0; i < nums.length; i++) {
          if (nums[i] == id) {
            liB.innerHTML = '<img src="./img/icon/喜欢.svg" class="yes">';
          }
        }
      }
      // console.log(hotArr,myArr,nums);

      ul.appendChild(liName);
      ul.appendChild(liSing);
      ul.appendChild(liTime);
      ul.appendChild(liB);
      li.appendChild(ul);
      list.appendChild(li);
    }

    let lis = document.querySelectorAll("#list>li");
    lis[point].className = "active";

    // let lis = document.querySelectorAll("#list>li")
    // 点击收藏按钮之后，存储的信息再myArr中
    let love = document.querySelectorAll(".yes");
    for (let i = 0; i < love.length; i++) {
      let flag = 1;
      // 点击收藏取消
      love[i].onclick = function (e) {
        e.stopPropagation();
        if (flag) {
          love[i].src = "./img/icon/喜欢.svg";
          nums[nums.length] = hotArr[i].id;
          myArr.push(hotArr[i]);
          flag = 0;
        } else {
          love[i].src = "./img/icon/no.svg";
          myArr.splice(i, 1);
          nums.splice(i, 1);
          flag = 1;
        }
      };
    }

    // 点击出现歌词
    //  "http://www.coderyq.cn:3000/lyric?id=" 获取歌词
    for (let i = 0; i < lis.length; i++) {
      lis[i].onclick = function () {
        for (let i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        lis[i].className = "active";
        let query = hotArr[i].id;
        let mvid = hotArr[i].mvid;
        write(query, mvid,i, hotArr);
      };
    }
  }

  // 默认音量大小
  audio.volume = 0.5;
  move.style.left = -50 + "px";
  circle.style.left = 50 - 10 + "px";
  // （1）点击音量键显示调节按钮，否则隐藏
  let flag = true;
  vImg.onclick = function () {
    if (flag) {
      cdiv.style.display = "block";
    } else {
      cdiv.style.display = "none";
    }
    flag = !flag;
  };

  // 制作加减音量的拖动效果
  mode.onmousedown = down;

  function down(e) {
    moves(e);
    document.body.onmousemove = function (e) {
      // 计算移动距离
      moves(e);
      document.body.style.userSelect = "none";
    };
  }

  // 清除移动
  document.body.onmouseup = () => (document.body.onmousemove = null);

  // 关于移动距离的计算
  function moves(e) {
    // getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
    let duanLength = (e.pageX - mode.getBoundingClientRect().left).toFixed(2);
    move.style.left =
      duanLength - 100 + "px";
    circle.style.left =
      duanLength - 10 + "px";
    confine(duanLength);
  }
  // 关于移动距离的限制
  function confine(duanLength) {
    // 设置音量
    if (duanLength >= cdiv.offsetWidth) {
      move.style.left = 0 + "px";
      circle.style.left = 100 - 10 + "px";
      audio.volume = (
        (duanLength >= 0 ? duanLength : -duanLength) / cdiv.offsetWidth
      ).toFixed();
    } else if (duanLength <= 0) {
      move.style.left = -100 + "px";
      circle.style.left = -10 + "px";
      audio.volume = 0;
    } else {
      audio.volume = (
        (duanLength >= 0 ? duanLength : -duanLength) / cdiv.offsetWidth
      ).toFixed(2);
    }

    // 设置音量显示图片
    if (audio.volume == 0) {
      vImg.src = "./img/icon/24gf-volumeCross.svg";
    } else if (audio.volume <= 0.4) {
      vImg.src = "./img/icon/24gf-volumeLow.svg";
    } else if (audio.volume <= 0.7) {
      vImg.src = "./img/icon//24gf-volumeMiddle.svg";
    } else {
      vImg.src = "./img/icon/24gf-volumeHigh.svg";
    }
  }
  // 音量拖动制作结束-------------------------------

  // 点击热门歌曲后进行处理
  // 我的收藏开始------------------------------
  let menu = document.querySelector("#menu");
  menu.onclick = function () {
    menu.style.background = "#476644";
    menu.style.color = "#fff";
    hot.style.background = "";
    hot.style.color = "#86a074";
    list.innerHTML = "";
    // 将歌词存储添加到列表
    for (let i = 0; i < myArr.length; i++) {
      let li = document.createElement("li");
      let ul = document.createElement("ul");

      let liName = document.createElement("li");
      liName.innerHTML = myArr[i].song;

      let liSing = document.createElement("li");
      liSing.innerHTML = myArr[i].artist;

      let liTime = document.createElement("li");
      liTime.innerHTML = myArr[i].album;
      let liB = document.createElement("li");
      // 添加新的列表
      liB.innerHTML = '<img src="./img/icon/喜欢.svg" class="yes">';
      ul.appendChild(liName);
      ul.appendChild(liSing);
      ul.appendChild(liTime);
      ul.appendChild(liB);
      li.appendChild(ul);
      list.appendChild(li);
    }

    // 获取收藏状态，需要记录收藏状态，并且进行存储
    // 需要进行相对于的音乐url配置
    let love = document.querySelectorAll(".yes");
    for (let i = 0; i < love.length; i++) {
      love[i].onclick = function () {
        myArr.splice(i, 1);
        this.parentNode.parentNode.parentNode.remove();
      };
    }

    let lis = document.querySelectorAll("#list>li");

    // 获取audio.src 歌词
    for (let i = 0; i < lis.length; i++) {
      lis[i].onclick = function () {
        sImg.style.left = -15 + "px";
        mMove.style.left = -1200+"px";
        // line = 0

        for (let i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        this.className = "active";
        let query = myArr[i].id;
        let mvid = myArr[i].mvid;
        write(query, mvid, i, myArr);
      };
    }
  };
  // 我的收藏结束------------------------------

  // 搜索开始--------------------------------------
  let nums = [];
  // 搜索触发
  search.onclick = function () {
    list.innerHTML = "";
    let xhr = new XMLHttpRequest();
    url =
      "http://www.coderyq.cn:3000/search?keywords=" +
      document.querySelector("#searchText").value;
    xhr.open("get", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        let rep = eval("(" + xhr.responseText + ")");
        // 点击搜索，获取搜索关键词下拉列表
        // 对歌曲进行筛选，只留下能播放的, 因为觉得不会播放影响体验
        for (let i = 0; i < rep.result.songs.length; i++) {
          // 如果出现两次不再添加&&indexedof(rep.result.songs[i].id)
          let li = document.createElement("li");
          let ul = document.createElement("ul");

          let liName = document.createElement("li");
          liName.innerHTML = rep.result.songs[i].name;

          let liSing = document.createElement("li");
          liSing.innerHTML = rep.result.songs[i].artists[0].name;

          let liTime = document.createElement("li");
          liTime.innerHTML = rep.result.songs[i].album.name;
          let liB = document.createElement("li");
          // 添加新的列表

          searchArr.push({
            id: rep.result.songs[i].id,
            mvid: rep.result.songs[i].mvid,
            song: rep.result.songs[i].name,
            artist: rep.result.songs[i].artists[0].name,
            album: rep.result.songs[i].album.name,
            albumImg: rep.result.songs[i].artists[0].picUrl,
            bgImg: rep.result.songs[i].artists[0].img1v1Url,
          });

          // 为空时所有都设置为不收藏状态
          liB.innerHTML = '<img src="./img/icon/no.svg" class="yes">';

          let id = rep.result.songs[i].id;
          if (nums.length !== 0) {
            for (let i = 0; i < nums.length; i++) {
              if (nums[i] == id) {
                liB.innerHTML = '<img src="./img/icon/喜欢.svg" class="yes">';
              }
            }
          }

          ul.appendChild(liName);
          ul.appendChild(liSing);
          ul.appendChild(liTime);
          ul.appendChild(liB);
          li.appendChild(ul);
          list.appendChild(li);

          let point = 0;
          prev.onclick = function () {
            textObj.style.top = 100 + "px";
            sImg.style.left = -15 + "px";
            mMove.style.left = -1200 + "px";
            if (cycle.querySelector("img").title == "循环播放") {
              if (point == 0) {
                point = lis.length - 1;
              } else {
                point--;
              }
            } else if (cycle.querySelector("img").title == "顺序播放") {
              if (point == 0) {
                point = 0;
                alert("已经是第一首歌");
              } else {
                point--;
              }
            } else if (cycle.querySelector("img").title == "随机播放") {
              random();
            }
            for (let i = 0; i < lis.length; i++) {
              lis[i].className = "";
            }
            lis[point].className = "change";

            audio.src =
              "http://music.163.com/song/media/outer/url?id=" +
              searchArr[point].id +
              ".mp3";
            title.innerHTML = searchArr[point].song;
            singer.innerHTML = searchArr[point].artist;
            tImg.src = searchArr[point].albumImg;
            bgImg.src = searchArr[point].bgImg;
            hImg.src = searchArr[point].albumImg;

            for (let i = 0; i < lis.length; i++) {
              lis[i].className = "";
            }
            lis[point].className = "active";
            let query = rep.result.songs[point].id;
            let mvid = rep.result.songs[point].mvid;
            write(query, mvid, point, searchArr);
          };

          next.onclick = function () {
            let lis = document.querySelectorAll("#list>li");
            sImg.style.left = -15 + "px";
            mMove.style.left = -1200 + "px";
            // 判断播放条件
            if (cycle.querySelector("img").title == "循环播放") {
              if (point == lis.length - 1) {
                point = 0;
              } else {
                point++;
              }
            } else if (cycle.querySelector("img").title == "顺序播放") {
              if (point == lis.length - 1) {
                point = lis.length - 1;
                alert("已经是最后一首歌");
              } else {
                point++;
              }
            } else if (cycle.querySelector("img").title == "随机播放") {
              random();
            }

            for (let i = 0; i < lis.length; i++) {
              lis[i].className = "";
            }
            lis[point].className = "change";

            audio.src =
              "http://music.163.com/song/media/outer/url?id=" +
              searchArr[point].id +
              ".mp3";
            title.innerHTML = searchArr[point].song;
            singer.innerHTML = searchArr[point].artist;
            tImg.src = searchArr[point].albumImg;
            bgImg.src = searchArr[point].bgImg;
            hImg.src = searchArr[point].albumImg;

            for (let i = 0; i < lis.length; i++) {
              lis[i].className = "";
            }
            lis[point].className = "active";
            let query = rep.result.songs[point].id;
            let mvid = rep.result.songs[point].mvid;
            write(query, mvid, point, searchArr);
          };
        }
        // 点击收藏，存储再MyArr里面
        searchlove(rep);

        // 点击播放的操作
        // 点击出现歌词
        //  "http://www.coderyq.cn:3000/lyric?id=" 获取歌词
        let lis = document.querySelectorAll("#list>li");
        for (let i = 0; i < lis.length; i++) {
          lis[i].onclick = function () {
            for (let i = 0; i < lis.length; i++) {
              lis[i].className = "";
            }
            this.className = "active";
            let query = rep.result.songs[i].id;
            let mvid = rep.result.songs[i].mvid;
            write(query, mvid, i, searchArr);
          };
        }
      }
    };
    xhr.send();
  };
  // 搜索结束--------------------------------------

  // 获取歌词开始----------------------------------
  // 获取歌词 歌曲audio函数
  function write(query, mvid, index, arr) {
    textObj.style.top = 100 + "px";
    audio.currentTime = 0;
    textObj.innerHTML = "";
    sImg.style.left = -15 + "px";
    mMove.style.left = -1200 + "px";
    line = 0;
    let lis = document.querySelectorAll("#list>li");
    for (var i = 0; i < lis.length; i++) {
      lis[i].className = "";
    }
    lis[index].className = "active";

    title.innerHTML = arr[index].song;
    singer.innerHTML = arr[index].artist;
    if (arr[index].albumImg == null) {
      tImg.src =
        "https://static.damengxiang.me/files/icon/2018/08-08/161713046529557373.jpg";
      hImg.src =
        "https://static.damengxiang.me/files/icon/2018/08-08/161713046529557373.jpg";
    } else {
      tImg.src = arr[index].albumImg;
      hImg.src = arr[index].albumImg;
    }
    if ((bgImg.src = null)) {
      bgImg.src =
        "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg";
    } else {
      bgImg.src = arr[index].bgImg;
    }
    //  console.log(searchArr[i].albumImg==null,searchArr[i].bgImg)

    let url = "http://www.coderyq.cn:3000/lyric?id=" + query;
    // 点击对应的歌词改编歌曲播放信息以及获取歌词，audio音频的信息
    // 添加歌区url
    audio.src =
      "http://music.163.com/song/media/outer/url?id=" + query + ".mp3";

    // 获取总时长

    // 判断歌词url是否可用
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", audio.src);
    xmlhttp.send();
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.Status != 200) {
        audio.src =
          "http://music.163.com/song/media/outer/url?id=" + mvid + ".mp3";
      }
    }

    // 获取歌词信息开始---------------------------------------
    let gcxhr = new XMLHttpRequest();
    gcxhr.open("get", url);
    gcxhr.onreadystatechange = function () {
      if (
        gcxhr.readyState === 4 &&
        (gcxhr.status === 200 || gcxhr.status === 304)
      ) {
        let res = eval("(" + gcxhr.responseText + ")");
        // 有歌词的获取歌词，每个词的返回暂无歌词
        if (lis[index].className == "active" && "lrc" in res) {
          // 有歌词将歌词添加到列表
          // 把对应的歌曲添加到页面中
          medisArr = [];
          textObj.innerHTML = "";
          wordArr = res.lrc.lyric.split("\n");
          for (let i of wordArr) {
            // 遍历歌词数组
            i = i.trim(); //去空格
            let tw = i.substring(i.indexOf("[") + 1, i.indexOf("]")); // 获取歌词部分
            // 不应该在点击列表时添加，应该在歌曲改变时更改
            medisArr.push({
              t:
                parseInt(tw.slice(tw.indexOf("[") + 1, tw.indexOf(":"))) * 60 +
                Number(tw.slice(tw.indexOf(":") + 1, tw.indexOf("."))) +
                Number(
                  (tw.slice(tw.indexOf(".") + 1, tw.length) / 1000).toFixed(3)
                ),
              w: i.slice(i.indexOf("]") + 1, i.length).trim(),
            });
          }
          // 把歌词填进歌词列表
          let num = 0;
          for (let i of medisArr) {
            let li = document.createElement("li");
            li.setAttribute("index", num);
            li.innerHTML = i.w;
            if (li.innerHTML == "") {
              continue;
            }
            num++;
            textObj.appendChild(li);
          }
          wordHeight =
            textObj.offsetHeight / document.querySelectorAll("#text>li").length;
          lineHeight(line);
        }
      } else {
        textObj.innerHTML = "网易云，最懂你的音乐";
      }
      // 点击歌曲获取MV
    };
    gcxhr.send();

    let time = document.getElementById("time")
    // 添加歌词滚动
    audio.ontimeupdate = function () {
      texts = document.querySelectorAll("#text>li");
      Length = ((audio.currentTime / audio.duration) * mModeWidth).toFixed();      
      time.innerHTML = times(audio.currentTime)+"/"+times(audio.duration)
      sImg.style.left = Length - 15 + "px";
      mMove.style.left = Length - mMoveWidth + "px";
      if (texts.length > 1) {
        if (
          line == medisArr.length - 1 &&
          audio.currentTime.toFixed() >= parseFloat(medisArr[line].t)
        ) {
          lineHeight(line);
        }
        if (
          parseInt(medisArr[line].t) <= audio.currentTime.toFixed() &&
          medisArr[line + 1].t >= audio.currentTime.toFixed()
        ) {
          lineHeight(line);
          line++;
        }
        textObj.style.top = -wordHeight * line + 100 + "px";
      }      
    };
    pp();
  }

  // 获取歌词结束-----------------------------------

  // 热门歌曲点击收藏存储信息
  function hotlove(rep) {
    // let lis = document.querySelectorAll("#list>li")
    // 点击收藏按钮之后，存储的信息再myArr中
    let love = document.querySelectorAll(".yes");
    for (let i = 0; i < love.length; i++) {
      let flag = 1;
      // 点击收藏取消
      love[i].onclick = function (e) {
        e.stopPropagation();
        if (flag) {
          love[i].src = "./img/icon/喜欢.svg";
          nums[nums.length] = rep.result[i].id;
          myArr.push({
            id: rep.result[i].id,
            mvid: rep.result[i].mvid,
            song: rep.result[i].name,
            artist: rep.result[i].song.album.artists[0].name,
            album: rep.result[i].song.album.name,
            albumImg: rep.result[i].picUrl,
            bgImg: rep.result[i].song.album.blurPicUrl,
          });
          flag = 0;
        } else {
          love[i].src = "./img/icon/no.svg";
          myArr.splice(i, 1);
          nums.splice(i, 1);
          flag = 1;
        }
      };
    }
  }

  // 搜索时进行数据存储
  function searchlove(rep) {
    // 点击收藏按钮之后，存储的信息再myArr中
    let love = document.querySelectorAll(".yes");
    for (let i = 0; i < love.length; i++) {
      let flag = 1;
      // 点击收藏取消
      love[i].onclick = function (e) {
        e.stopPropagation();
        if (flag) {
          love[i].src = "./img/icon/喜欢.svg";
          nums[nums.length] = rep.result.songs[i].id;
          myArr.push({
            id: rep.result.songs[i].id,
            mvid: rep.result.songs[i].mvid,
            song: rep.result.songs[i].name,
            artist: rep.result.songs[i].artists[0].name,
            album: rep.result.songs[i].album.name,
            albumImg: rep.result.songs[i].artists[0].picUrl,
            bgImg: rep.result.songs[i].artists[0].img1v1Url,
          });
          flag = 0;
        } else {
          love[i].src = "./img/icon/no.svg";
          myArr.splice(i, 1);
          nums.splice(i, 1);
          flag = 1;
        }
      };
    }
  }

  // 实现文字高亮显示
  function lineHeight(line) {
    let lis = document.querySelectorAll("#text>li");
    if (textObj.innerHTML.length > 1) {
      if (line > 0) {
        for (let i = 0; i < textObj.children.length; i++) {
          lis[i].className = "";
        }
        lis[line].className = "line";
      } else {
        // lis[0].className = "line"
      }
    }
  }

  // 控件设置
  // 播放开启歌词滚动 开始制作开始，暂停 上一首，下一首，声音，循环播放
  // 1. 播放开关
  let play = document.querySelector("#play");
  play.onclick = function () {
    if (audio.paused) {
      audio.play();
      play.querySelector("img").src = "./img/icon/24gf-pauseCircle.svg";
      play.querySelector("img").title = "播放";
    } else {
      audio.pause();
      play.querySelector("img").src = "./img/icon/24gf-playCircle.svg";
      play.querySelector("img").title = "暂停";
    }
    // change()
    // lineHeight()
    // pp()// 判断歌曲状态
  };

  // 2. 切换歌曲播放模式
  let cycle = document.querySelector("#cycle");
  let pt = 2;
  let point = 0;
  cycle.onclick = function () {
    if (pt == 0) {
      // 循环
      cycle.querySelector("img").src = "./img/icon/循环播放.svg";
      cycle.querySelector("img").title = "循环播放";
      pt = 1;
    } else if (pt == 1) {
      // 顺序
      cycle.querySelector("img").src = "./img/icon/顺序播放.svg";
      cycle.querySelector("img").title = "顺序播放";
      pt = 2;
    } else if (pt == 2) {
      // 随机
      cycle.querySelector("img").src = "./img/icon/随机播放.svg";
      cycle.querySelector("img").title = "随机播放";
      pt = 0;
    }
  };

  function pp() {
    if (play.querySelector("img").title == "暂停") {
      audio.pause();
    } else {
      audio.autoplay = "autoplay";
    }
  }

  // 随机播放函数
  function random(){
    var lis = document.querySelectorAll("#list>li")
    var num = point
    var sum=parseInt(Math.random()*lis.length)
    // 防止随机播放的是同一首歌
    while(num==sum){
      sum=parseInt(Math.random()*lis.length)
    }
    point = sum   
  }

  function times(time){
    f = parseInt(time/60)>9?parseInt(time/60):"0"+parseInt(time/60)
    s = parseInt(time%60)>9?parseInt(time%60):"0"+ parseInt(time%60)
    return f+":"+s
  }
};
