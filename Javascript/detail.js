const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
let API = "http://localhost:3000/product";
fetch(API)
  .then((rsp) => rsp.json())
  .then((data) => {
    const product = data.find((p) => p.id == productId);
    displayProduct(product);
  });
function change_img(x) {
  document.getElementById("main_img").src = x;
}
function displayProduct(data) {
  document.querySelector(
    ".anh"
  ).innerHTML = `<img src="img/${data.imageProduct}" alt="" id="main_img" />`;

  var str = "";
  for (var i = 0; i < data.imageProductList.length; i++) {
    str += `
      <div class="album"><img src="img/${data.imageProductList[i]}" alt="" onmouseover = "change_img(this.src)" /></div>
  
      `;
  }

  document.querySelector(".albumanh").innerHTML = str;
  document.querySelector(".c1").innerHTML = `<div
  class="ten"
  title="${data.nameProduct}"
  >
  ${data.nameProduct}
  </div>`;
  document.querySelector(".box3").innerHTML = `
  <div class="slb">${data.soldProduct}</div>
  <div class="daban">Đã Bán</div>
  `;
  document.querySelector(".gia").innerHTML = `
  <div class="gia2">₫${data.priceProduct.toLocaleString("vi-VN")}</div>
  <div class="gia3" style="display: ${data.hide}">${data.sale} giảm</div>`;
  document.querySelector(".ct3").innerText = data.description;
  document.querySelector(
    ".cosan"
  ).innerText = `${data.available} sản phẩm có sẵn`;

  window.onload = () => {
    showCart();
  };
  let displayCart = (item) => {
    return `
    <li class="cartList-item">
    <div class="item_content">
    <img src="img/${item.imageProduct}" alt="" class="cartList-item_img">
    <div class="cartList-item_content">
      <div class="cartList-info">
        <div class="cartList-item_name">${item.nameProduct}</div>
        <div class="cartList-item_price">
          <span class="cartList-item_price-label">₫</span>
          <span class="cartList-item_price-num">${item.priceProduct.toLocaleString(
            "vi-VN"
          )}</span>
        </div>
      </div>
    </div>
    </div>
  </li>`;
  };
  function showCart() {
    fetch("http://localhost:3000/cart")
      .then((response) => response.json())
      .then((cartStore) => {
        if (cartStore.length > 0) {
          let listAdded = cartStore.map(displayCart);
          let minItem = Math.min(cartStore.length, 5);
          document.querySelector(".basket_items").innerHTML = listAdded
            .slice(0, minItem)
            .join("");
          if (cartStore.length > 5) {
            document.querySelector(".numberAdded_act").style.display = "flex";
            document.querySelector(".numAdd").innerText = `${
              cartStore.length - 5
            } Thêm Vào Giỏ Hàng`;
          }
          document.querySelector(".cartNotice").style.display = "block";
          document.querySelector(".cartNotice").innerHTML = cartStore.length;
        } else {
          document
            .querySelector(".basket_cartList")
            .classList.add("basket_cartList-noCart");
          document.querySelector(".basket_cartList-addedCart").style.display =
            "none";
        }
        let linkProductCart = document.querySelectorAll(".item_content");
        linkProductCart.forEach((linkProduct, index) => {
          linkProduct.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = `/chitietsp.html?id=${cartStore[index].id}`;
          });
        });
      });
  }

  function addCart() {
    const cart = { ...data };
    cart.quantity = amount;
    cart.total = cart.quantity * cart.priceProduct;
    fetch("http://localhost:3000/cart")
      .then((response) => response.json())
      .then((cartStore) => {
        const existingProductIndex = cartStore.findIndex(
          (item) => item.id === cart.id
        );

        if (existingProductIndex !== -1) {
          cartStore[existingProductIndex].quantity += amount;
          cartStore[existingProductIndex].total =
            cartStore[existingProductIndex].quantity *
            cartStore[existingProductIndex].priceProduct;
          fetch(
            `http://localhost:3000/cart/${cartStore[existingProductIndex].id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(cartStore[existingProductIndex]),
            }
          )
            .then((response) => response.json())
            .then(() => {
              showCart();
            })
            .catch((error) => console.error("Error updating cart:", error));
        } else {
          fetch("http://localhost:3000/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cart),
          })
            .then((response) => response.json())
            .then(() => {
              showCart();
            })
            .catch((error) =>
              console.error("Error adding product to cart:", error)
            );
        }
      });
  }

  let amount = 1;
  document.querySelector(".decs").addEventListener("click", () => {
    if (amount > 1) {
      amount--;
      document.querySelector(".amount").innerHTML = amount;
    }
  });
  document.querySelector(".incs").addEventListener("click", () => {
    amount++;
    document.querySelector(".amount").innerHTML = amount;
  });
  document.querySelector(".add button").addEventListener("click", () => {
    addCart();
  });
  let ct = document.querySelectorAll(".tp2");
  ct[0].innerText = data.khuyenMai;
  ct[1].innerText = data.available;
  ct[2].innerText = data.address;
  document.querySelector("title").innerText = data.nameProduct;
}
// console.log(data);
