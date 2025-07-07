<template>
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-brand-top">
            <h2>Shop Huy Vui</h2>
            <p>Mua sắm dễ dàng - Giao hàng tận nơi</p>

          </div>
          <div class="footer-brand-icons">
            <a href="https://web.facebook.com/vui.tranhuy.7"><i class="fa-brands fa-square-facebook"></i></a>
            <a href="https://www.instagram.com/huyvuitran/"><i class="fa-brands fa-instagram"></i></a>
            <a href=""><i class="fa-solid fa-envelope"></i></a>
              <a href="https://www.youtube.com/@vuitran-n2k"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <div>
            <h4>Home</h4>
            <ul>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Điều khoản</a></li>
            </ul>
          </div>
          <div>
            <h4>Dịch vụ</h4>
            <ul>
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Chăm sóc khách hàng</a></li>
            </ul>
          </div>
          <div>
            <h4>Thanh toán</h4>
            <ul>
              <li>Chấp nhận: Visa, MasterCard, Momo, ZaloPay</li>
              <li>Thanh toán khi nhận hàng (COD)</li>
              <li>Bảo mật thông tin 100%</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Vui Store</p>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background-color: #6f6f6f;
    color: white;
    padding: 30px;
    margin-top: 40px;
    font-size: 14px;
    padding-bottom: 10px;
  }
  .footer-top {
    display: flex;
    /* flex-wrap: wrap; */
    justify-content: space-between;
    /* gap: 30px; */
    /* padding: 50px;  */
    /* margin-top: 20px; */
    padding-right: 80px;
    padding-left: 50px;
  }
  .footer-brand {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .footer-brand-top{
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-left: 10px;
  }
  .footer-brand h2 {
    /* margin-bottom: 10px; */
    color: #f1c40f;
  }
  .footer-brand-icons{
    display: flex;
    flex-direction: row;
    padding: 10px;
    justify-content: space-between;
    /* margin-left: ; */
    /* background-color: #fff; */
  }
  .footer-brand-icons a{
    padding: 0;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    background-color: #fff;
    color: #555;
    /* border: solid 1px rgb(116, 42, 42); */
    /* justify-content: left; */
    /* border: solid 2px re/d; */
    text-decoration: none;
  }
  .footer-brand-icons a:hover{
    border: solid 1px red;
  }

  .footer-links {
    display: flex;
    gap: 40px;
    margin-top: 10px;
    /* flex: 3, 2; */
    /* margin-right: 100px; */
    /* margin-left: 20px; */
  }
  .footer-links div h4 {
    margin-bottom: 10px;
    font-size: 15px;
    color: #f1c40f;
  }
  .footer-links ul {
    list-style: none;
    padding: 0;
  }
  .footer-links li {
    margin-bottom: 6px;
  }
  .footer-links a {
    color: #ccc;
    text-decoration: none;
  }
  .footer-links a:hover {
    color: white;
    text-decoration: underline;
  }
  .footer-bottom {
    text-align: center;
    margin-top: 30px;
    border-top: 1px solid #555;
    padding-top: 15px;
    font-size: 13px;
    color: #aaa;
  }
  </style>
  