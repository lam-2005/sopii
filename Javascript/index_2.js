const getProduct = (cb) => {
  let API = "http://localhost:3000/product";
  fetch(API)
    .then((rsp) => rsp.json())
    .then((data) => {
      cb(data);
    });
};
// console.log(product);
const root = (data) => {
  let product = data;

  // render sản phẩm
  const displayProduct = (item) => {
    return `
      <div class="product">
      <div class="content_pro" style="display: contents">
        <div class="pro">
          <a href="" class="link_product">
            <div class="product_image">
              <img src="img/${item.imageProduct}" alt="" class="proImg" />
              <div class="product_label">
                <img src="img/label.png" alt="" class="labelImg" />
              </div>
              <div class="product_sale" style="display: ${item.hide}">
                <span>${item.sale}</span>
              </div>
            </div>
            <div class="product_name">
              <div class="proName">
              ${item.nameProduct}
              </div>
            </div>
            <div class="proLabel"></div>
            <div class="product_cost">
              <div class="product_price">
                <span class="cost Label">₫</span>
                <span class="cost Price">${item.priceProduct.toLocaleString(
                  "vi-VN"
                )}</span>
              </div>
              <div class="product_sold">Đã bán ${item.soldProduct}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
      `;
  };
  let display = product.map(displayProduct).join("");
  document.querySelector(".products").innerHTML = display;
  //chuyển sang trang chi tiết
  let linkProducts = document.querySelectorAll(".link_product");
  linkProducts.forEach((linkProduct, index) => {
    linkProduct.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = `/chitietsp.html?id=${product[index].id}`;
    });
  });

  //hiển thị giỏ hàng
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

  window.onload = () => {
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
  };
};

getProduct(root);
