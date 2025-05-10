
const api = "http://localhost:3000/cart";
fetch(api)
  .then((rsp) => rsp.json())
  .then((data) => {
    showCart(data);
    handleCheckbox(data);
    handleQuantity(data);
    handleRemoveProduct(data);
  });
let displayCart = (item, index) => {
  return `
      <div class="cart_list_products_pro">
      <div class="pro_main">
        <div class="pro_detail pro_main_contents">
          <div class="cart_list_checkBox">
            <input type="checkbox" id="checkBox_cart${index}" class ='subCheckbox'>
            <label for="checkBox_cart${index}"></label>
          </div>
          <div class="cart_list_title_1">
            <div class="proCart_product">
              <a href=""><img src="img/${
                item.imageProduct
              }" alt="" class="proCart_product_img"></a>
              <div class="proCart_product_label"><a title="${
                item.nameProduct
              }" href="">${item.nameProduct}</a></div>
            </div>
            <div class="proCart_classify">
            </div>
          </div>
          <div class="cart_list_title_2">
            <div class="proCart_price">
              <div class="currentPrice">
                <span class="price_label">₫</span>
                <span class="currentPrice_num margin">${item.priceProduct.toLocaleString(
                  "vi-VN"
                )}</span>
              </div>
            </div>
          </div>
          <div class="cart_list_title_3">
            <div class="proCart_amount">
              <button class="decs"><span>-</span></button>
              <span class="amount">${item.quantity}</span>
              <button class="incs"><span>+</span></button>
            </div>
          </div>
          <div class="cart_list_title_4">
            <div class="proCart_cost">
                <span class="price_label">₫</span>
                <span class="currentPrice_numTotal margin">${item.total.toLocaleString(
                  "vi-VN"
                )}</span>
            </div>
          </div>
          <div class="cart_list_title_5">
            <div class="proCart_act">
                <button class="removePro">Xóa</button>
                <div class="difPro">
                  <a href="#">
                    <div class="difPro_title">Tìm sản phẩm tương tự</div>
                    <div class="difPro_arrow" style="font-size: .675rem;">▼</div>
                  </a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `;
};
function showCart(data) {
  let dataCart = data;
  let listAdded = dataCart.map(displayCart);
  document.querySelector(".cart_list_products").innerHTML = listAdded.join("");
  document.querySelector("section").innerHTML = `
    <div class=" cart_list_action_contents">
      <div class="cart_list_checkBox">
        <input type="checkbox" id="checkBox_cartLast"class ='mainCheckbox'>
        <label for="checkBox_cartLast"></label>
      </div>
      <label for="checkBox_cartLast"><div class="selectAll">Chọn Tất Cả (${dataCart.length})</div></label>
      <button class="remove" onclick="deleteAllProducts()">Xóa Tất Cả (${dataCart.length})</button>
      <div class="save">Lưu vào mục Đã thích</div>
    </div>
    <div class="totalAndAction">
      <div class="totalTitle">Tổng thanh toán (<span class= 'quantityPro'>0</span> Sản phẩm):<span class='totalCost'></span>
      </div>
    <div class="totalPrice">₫<span>0</span></div>
    <a href="" class="btnBuy"><button class="btn-product">MUA NGAY</button></a></div>
`;
  let linkDetail1 = document.querySelectorAll(".proCart_product_img");
  let linkDetail2 = document.querySelectorAll(".proCart_product_label");
  linkDetail1.forEach((linkProduct, index) => {
    linkProduct.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = `/chitietsp.html?id=${dataCart[index].id}`;
    });
  });
  linkDetail2.forEach((linkProduct, index) => {
    linkProduct.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = `/chitietsp.html?id=${dataCart[index].id}`;
    });
  });
}
let handleCheckbox = (data) => {
  let dataCart = data;
  if (dataCart.length === 0) {
    document.querySelector(".noCart").style.display = "flex";
    document.querySelector(".hasCart").style.display = "none";
  } else {
    document.querySelector(".hasCart").style.display = "block";
    showCart(dataCart);
  }
  const mainCheckbox = document.querySelectorAll(".mainCheckbox");
  let subCheckboxes = document.querySelectorAll(".subCheckbox");
  const checkboxArr = [];
  function updateMainCheckbox() {
    mainCheckbox.forEach((checkbox) => {
      checkbox.checked = [...subCheckboxes].every((cb) => cb.checked);
    });
  }
  function updateCheckboxArr() {
    checkboxArr.length = 0;
    subCheckboxes.forEach((cb) => {
      if (cb.checked) {
        checkboxArr.push(cb);
        updateTotal();
      }
    });
  }
  mainCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      syncCheckboxes(checkbox);
      subCheckboxes.forEach((cb) => {
        cb.checked = checkbox.checked;
      });
      updateCheckboxArr();
      updateTotal();
    });
  });
  subCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      updateMainCheckbox();
      updateCheckboxArr();
      updateTotal();
    });
  });
  function syncCheckboxes(clickedCheckbox) {
    mainCheckbox.forEach((checkbox) => {
      if (checkbox !== clickedCheckbox) {
        checkbox.checked = clickedCheckbox.checked;
      }
    });
  }
  function updateTotal() {
    let total = 0;
    for (let i = 0; i < subCheckboxes.length; i++) {
      if (subCheckboxes[i].checked) {
        total += dataCart[i].total;
      }
    }
    document.querySelector(".totalPrice span").innerText =
      total.toLocaleString("vi-VN");
    document.querySelector(".quantityPro").innerText = checkboxArr.length;
  }
};
let handleQuantity = (data) => {
  let dataCart = data;
  let incs = document.querySelectorAll(".proCart_amount .incs");
  incs.forEach((inc, i) => {
    inc.onclick = (event) => {
      event.preventDefault();
      let updateQuantity = dataCart[i].quantity + 1;
      let updateTotal = updateQuantity * dataCart[i].priceProduct;
      dataCart[i].quantity = updateQuantity;
      dataCart[i].total = updateTotal;
      let options = {
        method: "PATCH",
        body: JSON.stringify({
          quantity: updateQuantity,
          total: updateTotal,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(`http://localhost:3000/cart/${dataCart[i].id}`, options).then(
        (rsp) =>
          rsp.json().then((data) => {
            let up = document.querySelectorAll(".currentPrice_numTotal");
            up[i].innerHTML = dataCart[i].total.toLocaleString("vi-VN");
            let amountUp = document.querySelectorAll(".amount");
            amountUp[i].innerHTML = dataCart[i].quantity;
            handleCheckbox(dataCart);
          })
      );
    };
  });
  let decs = document.querySelectorAll(".proCart_amount .decs");
  decs.forEach((dec, i) => {
    dec.addEventListener("click", (e) => {
      e.preventDefault();
      if (dataCart[i].quantity > 1) {
        let updateQuantity = dataCart[i].quantity - 1;
        let updateTotal = updateQuantity * dataCart[i].priceProduct;
        dataCart[i].quantity = updateQuantity;
        dataCart[i].total = updateTotal;
        let options = {
          method: "PATCH",
          body: JSON.stringify({
            quantity: updateQuantity,
            total: updateTotal,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        fetch(`http://localhost:3000/cart/${dataCart[i].id}`, options)
          .then((rsp) => rsp.json())
          .then((data) => {
            let up = document.querySelectorAll(".currentPrice_numTotal");
            up[i].innerHTML = dataCart[i].total.toLocaleString("vi-VN");
            let amountUp = document.querySelectorAll(".amount");
            amountUp[i].innerHTML = dataCart[i].quantity;
            handleCheckbox(dataCart);
          });
      }
    });
  });
};
let handleRemoveProduct = (data) => {
  let dataCart = data;
  let removePro = document.querySelectorAll(".proCart_act .removePro");
  removePro.forEach((rev, i) => {
    rev.addEventListener("click", (e) => {
      e.preventDefault();
      let options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(`http://localhost:3000/cart/${dataCart[i].id}`, options)
        .then((rsp) => rsp.json())
        .then((data) => {});
    });
  });

  if (dataCart.length === 0) {
    document.querySelector(".hasCart").remove();
    document.querySelector(".noCart").style.display = "flex";
  }
};
function deleteAllProducts() {
  fetch("http://localhost:3000/cart")
    .then((rsp) => rsp.json())
    .then((dataCart) => {
      let deletePromises = dataCart.map((item) => {
        return fetch(`http://localhost:3000/cart/${item.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      Promise.all(deletePromises);
    });
}

// function remove(x) {
//   let pro =
//     x.parentElement.parentElement.parentElement.parentElement.parentElement;
//   let namePro = pro.querySelector(".proCart_product_label a").innerText;
//   console.log(namePro);

//   for (let i = 0; i < dataCart.length; i++) {
//     if (dataCart[i].nameProduct === namePro) {
//       dataCart.splice(i, 1);
//     }
//   }

//   pro.remove();

//   subCheckboxes = document.querySelectorAll(".subCheckbox");
//   localStorage.setItem("list", JSON.stringify(dataCart));
//   updateTotal();
// if (dataCart.length === 0) {
//   document.querySelector(".hasCart").remove();
//   document.querySelector(".noCart").style.display = "flex";
// }
// }
