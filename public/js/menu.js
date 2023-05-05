

var check = true;


const content = document.getElementById("content")
const sidebar = document.getElementById("sidebarMenu")
const openButton = document.querySelector('#toggleSidebar');

openButton.addEventListener('click', () => {
  if (check) {
    sidebar.style.left = '-240px';
    content.style.marginLeft = "30px";
    content.style.marginRight = "30px";
    content.style.transition = "all 0.5s ease-out";
    check = !check;

  } else {
    content.style.marginLeft = "270px";
    sidebar.style.left = '0px';
    content.style.transition = "all 0.5s ease-out";
    check = !check;
  }
});

// Lấy tất cả các item trong danh sách
var items = document.querySelectorAll('.list-group-item');

// Lặp qua từng item và thêm sự kiện click vào từng item
items.forEach((item) => {
  item.addEventListener('click', function () {
    // Xóa class "active" khỏi tất cả các item
    items.forEach(function (item) {
      item.classList.remove('active');
    });
    // Thêm class "active" vào item được click
    this.classList.add('active');
  });
});


function previewImage(event) {
  const input = event.target;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('image-preview').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

