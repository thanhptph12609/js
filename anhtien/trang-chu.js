window.app = {
  // 1. Viết function JS gọi lên cổng 3000
  getProducts: async function () {
    var data = await fetch("http://localhost:3000/products");
    // 2. Có được data
    data = await data.json();

    // tạo html từ data vừa nhân được
    var elements = data
      .map((product) => {
        return `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td><img src=${product.image} width="200px"></td>
                <td>${product.price}</td>
                <td>${product.detail}</td>
                <td><button onclick="app.deleteProduct(${product.id})">Xóa</button></td>
            </tr>
        `;
      })
      .join("");

    //  Chèn html vừa tạo vào file HTML
    document.getElementById("table-data").innerHTML = elements;
  },
  deleteProduct: async function (id) {
    // 1. Gọi lên localhost:3000/products/id với method DELETE
    await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    });

    // 2. Đợi kết quả từ backend, gọi lấy danh sản phẩm
    this.getProducts();
  },
  getDataEditProduct: async function () {
    var url = new URL(location.href);
    var id = url.searchParams.get("id");

    var product = await fetch(`http://localhost:3000/products/${id}`);
    product = await product.json();

    document.getElementById("name").value = product.name;
    document.getElementById("image").value = product.image;
    document.getElementById("detail").value = product.detail;
    document.getElementById("price").value = product.price;

    var categories = await fetch("http://localhost:3000/categories/");
    categories = await categories.json();

    var elements = categories
      .map((category) => {
        return `
          <option value="${category.id}" ${product.categoryId === category.id ? "selected" : ''}>
            ${category.name}
          </option>
      `;
      })
      .join("");
    document.getElementById("categoryId").innerHTML = elements;
  },
};
