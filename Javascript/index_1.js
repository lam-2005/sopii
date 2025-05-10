const list = document.querySelector(".listImages");
const anh = document.getElementsByClassName("imageBanner_1");
const nutTrai = document.querySelector(".btn-left");
const nutPhai = document.querySelector(".btn-right");
const length = anh.length;
let load = 0;
const thayDoi = (index) => {
  if (load == length - 1) {
    load = 0;
    let width = anh[0].offsetWidth;
    list.style.transform = `translateX(0px)`;
    document.querySelector(".noiBat").classList.remove("noiBat");
    document.querySelector(".dot-" + load).classList.add("noiBat");
  } else {
    load++;
    let width = anh[0].offsetWidth;
    list.style.transform = `translateX(${width * -1 * load}px)`;
    document.querySelector(".noiBat").classList.remove("noiBat");
    document.querySelector(".dot-" + load).classList.add("noiBat");
  }
};
let xuLi = setInterval(thayDoi, 5000);
nutPhai.addEventListener("click", () => {
  clearInterval(xuLi);
  thayDoi();
  xuLi = setInterval(thayDoi, 5000);
});
nutTrai.addEventListener("click", () => {
  clearInterval(xuLi);
  if (load == 0) {
    load = length - 1;
    let width = anh[0].offsetWidth;
    list.style.transform = `translateX(${width * -1 * load}px)`;
    document.querySelector(".noiBat").classList.remove("noiBat");
    document.querySelector(".dot-" + load).classList.add("noiBat");
  } else {
    load--;
    let width = anh[0].offsetWidth;
    list.style.transform = `translateX(${width * -1 * load}px)`;
    document.querySelector(".noiBat").classList.remove("noiBat");
    document.querySelector(".dot-" + load).classList.add("noiBat");
  }
  xuLi = setInterval(thayDoi, 5000);
});
const an_hien = document.querySelector(".banner");
an_hien.addEventListener("mouseover", () => {
  document.querySelector(".btns").style.display = "block";
});
an_hien.addEventListener("mouseout", () => {
  document.querySelector(".btns").style.display = "none";
});

var dots = document.querySelectorAll(".dots .dot");
dots.forEach((dots, index) => {
  dots.addEventListener("click", () => {
    load = index - 1;
    clearInterval(xuLi);
    thayDoi();

    xuLi = setInterval(thayDoi, 5000);
  });
});
function nextItem() {
  let btn_categoryRight = document.querySelector(".arrow-right");
  let btn_categoryLeft = document.querySelector(".arrow-left");
  let next = document.querySelector(".itemImages_list");
  next.style.transition = "margin-left 1s";
  next.style.marginLeft = "-30%";
  btn_categoryRight.style.display = "none";
  btn_categoryLeft.style.display = "block";
}
function prevItem() {
  let btn_categoryLeft = document.querySelector(".arrow-left");
  let btn_categoryRight = document.querySelector(".arrow-right");
  let next = document.querySelector(".itemImages_list");
  next.style.transition = "margin-left 1s";
  next.style.marginLeft = "0";
  btn_categoryRight.style.display = "block";
  btn_categoryLeft.style.display = "none";
}

window.addEventListener("scroll", () => {
  let scrollHeight = window.pageYOffset;
  let scroll_sticky = document.querySelector(".products_header");
  let heightLimit = document.querySelectorAll(".products_content").offsetHeight;
  if (scrollHeight > heightLimit) {
    scroll_sticky.style.position = "static";
  } else {
    scroll_sticky.style.position = "sticky";
  }
});
