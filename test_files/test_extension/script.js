const targetSelector = '.product-ratings .product-ratings__header';
let injectedElement;

function ce(tagName, attributes = {}, children = [], parent, insertIndex = null) {
  // Create the element
  const element = document.createElement(tagName);

  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  // Append children (recursively if needed)
  for (const child of children) {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else {
      console.error("Invalid child element:", child);
    }
  }

  if (insertIndex !== null) {
    const parentElement = parent; 
    if (parentElement.children.length > insertIndex) {
      parentElement.insertBefore(element, parentElement.children[insertIndex]);
    } else {
      parentElement.appendChild(element);
    }
  }

  return element;
}

function createTableFromJSON(jsonData) {
  // Create table element
  const table = document.createElement('table');
  table.classList.add('spam', 'table', 'data-table');

  const colgroup = document.createElement('colgroup');
  for (let i = 0; i < 2; i++) {
    const col = document.createElement('col');
    colgroup.appendChild(col);
  }
  table.appendChild(colgroup);

  // Add table header
  const header = document.createElement('thead');
  const headerRow = document.createElement('tr'); 
  for (const key in jsonData[0]) {
    const headerCell = document.createElement('th');
    headerCell.textContent = key;
    // headerCell.addEventListener('click', () => sortTable(key));
    headerRow.appendChild(headerCell);
  }
  header.appendChild(headerRow);
  table.appendChild(header);
  
  // Add table rows
  const body = document.createElement('tbody');
  jsonData.forEach(item => {
    const row = document.createElement('tr');
    for (const key in item) {
      const cell = document.createElement('td');
      cell.textContent = item[key];
      row.appendChild(cell);
    }
    body.appendChild(row);
  });
  table.appendChild(body);
 
  return table;
}

function pieChartJS(jsonData, parent) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  document.head.appendChild(script);
  script.onload = () => {
    // Chart.js is now available globally as 'Chart'
    const canvas = document.createElement('canvas');
    parent.appendChild(canvas)

    const labels = Object.keys(jsonData);
    const data = Object.values(jsonData);

    let myChart = new Chart(canvas, {
      type: 'pie',
      data: {
        datasets: [{
          data: data,
          backgroundColor: ['#FB3640', '#EFCA08']
        }],
        labels: labels
      },
      options: {
        // responsive: true,
        plugins: {
          legend: {
            position: 'right' // Set legend position to right
          }
        }
      }
    });

  };
}

// Example: 
const jsonData =  
  [{'Reviews': 'Giao Hàng Nhanh. Đóng Gói Đẹp.Giao Đúng Màu, Đặt size 41 giao đúng size 41. Chủ shop nhiệt tình. Dép giá hợp lý và đẹp nữa. Mn nhớ ủng hộ shop nha. Cho shop 5 sao',
    'Predict': 'non-spam'},
   {'Reviews': 'U là trời. Ưng ý lắm luôn nha mọi người. Chất da thì khỏi bàn cãi vì hàng chuẩn da xịn, chuẩn thương hiệu. Thiết kế cũng mang phong cách riêng. K đại trà Giao Hàng Nhanh. Đóng Gói Đẹp.Giao Đúng Màu, Đặt size 41 giao đúng size 41. Chủ shop nhiệt tình. Dép giá hợp lý và đẹp nữa. Mn nhớ ủng hộ shop nha.Thấy review trên shop đẹp mà rẻ nên mua thử, chất quá đẹp, quá ổn với giá tiền nha, màu đẹp như trong ảnh, da căng mịn. nói chung với giá đó khá là ok. Cho shop 5 sao',
    'Predict': 'non-spam'},
   {'Reviews': 'Hàng của shop mình đã mua và sử dụng thấy rất tốt.Tốt từ chát liệu đến fom dáng,cá bạn lên mua ủng hộ shop nha.Còn về chất lượng phục vụ shop tư vấn size số rất nhiệt tình .Xứng đáng 5 sao',
    'Predict': 'non-spam'},
   {'Reviews': 'Giá rẻ, săn sale còn rẻ hơn mà nhìu đồ, chất lượng mẫu mã đẹp. Nói chung là điểm 10 cho chất lượng. Nên mua nhé mọi người !',
    'Predict': 'non-spam'},
   {'Reviews': 'Shopee xưa giờ chuyên bán giá rẻ cho nên mình sợ vấn đề về chất lượng lắm. Nhưng từ khi mua được sản phẩm ở shop này thì mình đã yên tâm hơn rất rất là nhiều. nhận được hàng,hoàn toàn ưng ý về các sản phẩm của shop làm ăn nhanh chóng không lề mề,anh chủ thì tuyệt vời rồi rất nhiệt tình rep tin nhắn nhanh. Còn về sản phẩm rất đẹp hàng chuẩn như hình ảnh sản phẩm 9 thì shop 10 rồi. ủng hộ shop lâu dài',
    'Predict': 'non-spam'},
   {'Reviews': 'Mua của shop lâu rồi nay mới lên review. Sản phẩm rất đẹp, đóng gói cẩn thận, giao hàng cho bên vận chuyển nhanh. Mình mua về tặng chưa thẩm được chất lượng nhưng nhìn hình thức thì rất oki rồi. Mọi người nên mua của shop nhé. 5 sao cho chất lượng tuyệt vời.,',
    'Predict': 'non-spam'},
   {'Reviews': 'Mình muua size 41 mang rất vừa chân , form dép chuẩm nên k cần tăng size hay lùi size gì cả , về phần quai in rất sắc nét , đế dép mang siêu êm và nhẹ tênh luôn , cảm ơn shop đã cung cấp sảm phẩm tốt với giá cả quá rẻ👍👍👍👍❤❤❤',
    'Predict': 'non-spam'},
   {'Reviews': 'Sản phẩm đc đóng gói rất là cẩn thận, shop phục vụ nhiệt tình dép đi êm ko bị đau chân lần sau sẽ ủng hộ shop trong thời gian tới.Nói chung là mọi ng nên mua nha',
    'Predict': 'non-spam'},
   {'Reviews': 'Ui nhận được đôi dép siêu xinhhhh luônggggg. Shop quốc tế mà chuẩn bị hàng với ship nhanh quá hà, cỡ 2 ngày là nhận được nè. Săn sale giá hạt dẻ nựa',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép đẹp, giáo hàng nhanh chóng, đóng gói cẩn thận . Shop uy tín chất lượng giao đúng hình đúng mẫu . Hài lòng sẽ quay lại ủng hộ shop',
    'Predict': 'non-spam'},
   {'Reviews': 'Giao hàng nhanh dép đúng như hình Chuẩn mẫu chuẩn size mình đặt quá ưng ý sau sẽ ủng hộ shop tiếp tặng shop 5 sao cho động lực nhé',
    'Predict': 'spam'},
   {'Reviews': 'Dép xinh lắm mn ơi ban đầu mình sợ dép bị lỗi ấy nma không hề bị lỗi j luôn shop đóng gói cẩn thận bỏ trong hộp và có cả card cảm ơn nữâa dép lên form siu xinh luôn hình thêu cũng rất đẹp nữa miếng lót ở trong dày dặn êm lắm ạ mang lên nhẹ tênh luôn nchung cho shop 10',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp,mình chân 23 cm mang vừa vặn thoải mái.Shop gói hàng kĩ lắm,không bị móp méo gì,hộp đựng dép cũng đẹp nữa.À với lại mọi người nên mua đúng size nha vì dép có bề ngang khá rộng á nên mua đúng size mang sẽ vừa vặn hơn',
    'Predict': 'non-spam'},
   {'Reviews': 'đẹp đúng mẫu shop đóng gói cận thận lần sau sẽ ủng hộ shop hình ảnh mang tính chất minh họa à đây là dép của nam lên nữ mua thì lên lùi 1 sz thì vừa đẹp còn muốn đi rộng thì đi đúng sz',
    'Predict': 'spam'},
   {'Reviews': 'Shop giao hàng nhanh chóng Đóng gói kỹ càng, cẩn thận. Sp đúng như shop mô tả. Mình rất ưng sp này và mua cho cả gia đình mình dùng. Cảm ơn shop về sp này, sẽ ủng hộ shop nữa',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép đẹp và rất ưng ý. Shipper thân thiện, còn chêu kình nữa hhh. Shop đóng gói hàng kĩ quá làm mình mãi mới mở đc hihi. Nói chung hàng đẹp xịn cho 1 sao, ak đùa tí cho 5sao',
    'Predict': 'non-spam'},
   {'Reviews': 'Sản phẩm giao nhanh bọc hàng cẩn thận, màu sắc đúng như mô tả hy vọng là đi bền cho nó đi lại thoải mái, thích nên mua cho nó đi hy vọng là ok',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép đẹp lắm nhé shop ơi, đúng với hình nhé rẻ đẹp đeo khá êm chân, giao hàng nhanh lắm nhé rất ưng ạ lần sau sẽ lji ủng hộ shop ạ',
    'Predict': 'non-spam'},
   {'Reviews': 'Giao hàng nhanh, chất lượng tốt, đúng với mô tả, đi nhẹ, êm, vừa in luôn. Rất tốt, hàng đẹp, mình sẽ mua lại vào lần sau, mn nên mua nha\nC',
    'Predict': 'non-spam'},
   {'Reviews': 'Giao hàng siu nhanh,đặt hôm qua thì hôm nay có dép mang luôn, dép form đẹp ,quai ko bị rộng vừa ý mình, chân mình 25,5 chọn size 41 vừa luôn',
    'Predict': 'non-spam'},
   {'Reviews': 'Sau 2 ngày chờ đợi cuối cùng dép cũng về. Chất lượng dép tuyệt vời.Đi êm không trơn giá cả phải trăng quá xuất sắc luôn , ok la shop',
    'Predict': 'non-spam'},
   {'Reviews': 'Giao hàng nhanh. Sản phẩm hơi bị chất lượng lun nha mn. Nhìn rất chắc chắn. Mình mua giá sale 40k 1đôi. Quá là tuyệt vời lun ạk',
    'Predict': 'non-spam'},
   {'Reviews': 'Sản phẩm đẹp. Ship nhiệt tình. Giao hàng nhanh. Cảm ơn shop. Mua cho e trai k biết nó có đi vừa k nhưng mình là mình ưng hahaha',
    'Predict': 'non-spam'},
   {'Reviews': 'Lần đầu mua trên shop này mua với giá siêu rẻ hàng chất lẽ size phù hợp giá tiền tặng shop 5* vì mang vừa chân',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp, cầm nhẹ, mong là bền giá rẻ, giao hàng nhanh. Nên mua nhé mn. Mua cho em trai nhưng n chưa thử kb vừa k',
    'Predict': 'non-spam'},
   {'Reviews': 'Sp tốt đánh giá 5 sao, chất liệu co giãn êm chân, đã mua ủng hộ lần 2 lần sau vẫn sẽ mua ủng hộ tiếp 👍',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép mang êm chân lắm. Lớp đệm cũng không quá dày, không sợ đi mưa lâu khô. Đặt đúng size dép bình thường mình mang nha mọi người, nếu không vừa thì shop cũng cho đổi size nữa. Rất đáng tiền nha',
    'Predict': 'non-spam'},
   {'Reviews': 'Mình chụp không đẹp nhưng hàng siêu đẹp nha.với tầm giá này ko tin là mã hàng này nó xinh đến vậy luôn. Quá lag ok , sẽ quay lại mua và ủng hộ nhiều. Shop tư vấn cực nhiệt tình.',
    'Predict': 'non-spam'},
   {'Reviews': 'Đúng với mô tả: đóng gói cẩn thận, dép đẹp với cái số tiền này thì không mong chờ gi nhiều nhưng lúc nhận thì không ngờ rẻ mà đẹp nha nói chung là 10 điểm không có nhưng',
    'Predict': 'non-spam'},
   {'Reviews': 'dép phù hợp với giá tiền , chất liệu bằng cao su non đi cực êm luôn ấy, phối đồ đẹp lắm vì dép là mẫu mới , nên rất thích ạ,sẽ mua thêm để ủng hộ shop nha',
    'Predict': 'non-spam'},
   {'Reviews': 'Sản phẩm rất ok , đóng gói rất chắc chắn, hàng đặt 2 ngày là có hàng rồi ạ , rất đáng tiền , chờ ê mê 😘( nên ủng hộ shop nha mn 👍 ) 💗💗💗💗💗💗💗💗💗💗💗',
    'Predict': 'non-spam'},
   {'Reviews': 'đôi dép giá phải chăng mà đẹp lắm nha ạ shop giao đúng mẫu đúng size ạ.Mà dép bên shop có nhiều mẫu đẹp nữa nên có gì em sẽ ủng hộ shop lần sau',
    'Predict': 'spam'},
   {'Reviews': 'Đã nhận được một cái gì đó, đôi giày là đẹp. Màu sắc phù hợp với hình ảnh và thích nó. GDép thực sự tốt, chất lượng rất tốt, đề nghị cửa hàng này oh',
    'Predict': 'non-spam'},
   {'Reviews': 'Vận chuyển nhanh chóng, vật lý phù hợp với hình ảnh. Không lớn không nhỏ, vừa vặn vừa vặn chân, ăn mặc rất thoải mái. Rất tốt, sẽ được mua lại một lần nữa',
    'Predict': 'non-spam'},
   {'Reviews': '" Hàng rất Ưng.. \ngiống như mô tả.. \nmàu trắng đén quay dép rất mềm mang rất êm chân ..\nRất đáng mua.. chuẩn size nhé cả nhà."',
    'Predict': 'spam'},
   {'Reviews': 'Giao hàng nhanh, 3 ngày là có hàng rồi, đúng size, giá so với sản phẩm thì quá ok ạ, cho 5 sao nha 😚',
    'Predict': 'non-spam'},
   {'Reviews': 'hàng rất đẹp, hình thức ok, đóng gói cẩn thận nhưng chưa biết chất lượng như thế nào❤, nói chung là các bạn nên mua❤',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép rẻ nói chung là đẹp nma dép ngày chỉ mang đi chơi tại dép mình mua là màu trắng với giá thành như này hong đòi hỏi thêm được cái gì cao hơn quá Nói chung tuỳ vào đánh giá của mỗi người mình thấy sản phẩm này ổn mọi người xem xét có thể mua về sài thử',
    'Predict': 'non-spam'},
   {'Reviews': 'Chất nhựa cứng nhưng không bị thô, đi vừa và êm chân. Đi trong văn phòng là vừa, không có mùi hăng hay khét gì cả. Độ bền thì phải dùng mới biết được, chất nhựa nên đi trời mưa chắc không bị mùi đâu',
    'Predict': 'non-spam'},
   {'Reviews': '- Chất liệu cao su cao cấp đàn hồi tốt, chắc chắn. - Đi cực mát và êm, các bạn rửa chân thoải mái không sợ hỏng nhé. - Đế cực êm, đi đứng lâu vẫn thoải mái.',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép dẹp giao , đi thoải mái mà êm chân lắm , phân khúc giá lại vừa , mọi người lên mua thử dép tăng chiều cao thêm khoảng 3-4p thô',
    'Predict': 'non-spam'},
   {'Reviews': 'Sản phẩm đẹp đóng gói cẩn thận giao hàng nhanh shipper nhiệt tình kích thước hàng chuẩn',
    'Predict': 'spam'},
   {'Reviews': 'Thời gian giao hàng rất là nhanh lun, dép đẹp, giá rẻ, shop đóng gói cẩn thận nhưng có điều là dép màu trắng hơi kén da nên bạn nào da hơi ngâm thì nên chọn màu khá',
    'Predict': 'non-spam'},
   {'Reviews': 'Chọn cho cái hộp rách nát :( Giao đúng sản phẩm Đúng size Dép đi êm chân Da mềm. Cảm giác đi ko ôm chân, đi nhanh dễ tuột dép',
    'Predict': 'spam'},
   {'Reviews': 'Dép nhìn đẹp đi hơi nặng chân, chất liệu cũng ổn và đã mua 2 lần ở shop. Lần sau sẽ quay lại ủng hộ shop tiếp',
    'Predict': 'non-spam'},
   {'Reviews': 'Hàng đẹp lắm ạ giống ở shop lun ạ chất lượng sẽ ủng hộ lần sau bán hàng có tâm ạ giao nhanh rẻ',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp giao hàng nhanh uy tín đóng gói sản phẩm chắc chắn hợp với giá tiền lần sauu sẽ quay lại ủng hộ',
    'Predict': 'non-spam'},
   {'Reviews': 'Mẫu mã đúng ảnh Êm chân Shop tư vấn nhiệt tình và dễ thương Ship khá nhanh',
    'Predict': 'spam'},
   {'Reviews': 'DÉP ĐẸP,DA MỀM,MỊN,CẦM CHẮC TAY,ĐI KHÁ NHẸ,MUA GIÁ RẺ MÀ ĐƯỢC ĐÔI DÉP QUÁ XỊN XÒ,ĐÁNG ĐỂ MUA THỬ',
    'Predict': 'non-spam'},
   {'Reviews': 'Dép đẹp ưng mắt phù hợp với giá tiền. Giao hàng nhanh, nhiệt tình. Ủng hộ shop 5 sao',
    'Predict': 'non-spam'},
   {'Reviews': 'Giao hàng nhanh đóng gói cẩn thận hàng tốt chất lượng im dẹp đẹp mang dừa vận',
    'Predict': 'spam'},
   {'Reviews': 'Shop giao hàng nhanh đóng gói cẩn thận Sẽ ủng hộ shop tiếp lần sau',
    'Predict': 'spam'},
   {'Reviews': 'Trời ơi ,xinh suất sắc nha,đế cao,cứng ,chắc chắn ,đẹp ,nói chung ưng,sẽ đặt thêm nữa ,tui size 41 mà đặt hờ thêm 1size là size 42 mà ai dè vừa luôn,hơi rộng khoảng 1cm thoy hà ,bonus thêm anh shipper nói chuyện ấm áp quá chừng luôn,giao hàng nhanh',
    'Predict': 'non-spam'},
   {'Reviews': 'Quá tuyệt vời trắng full size 38 đẹp lắm nha mng nên mua nha shop cũng tư vấn nhiệt tình nữa mặc dù có bị giao lộn màu nhưng shop chịu trả hàng quá tuyệt vời cho shop 5*',
    'Predict': 'spam'},
   {'Reviews': 'Đúng với mô tả: dép đẹp lắm mn ạ , quá tuyệt vời luôn ạ , đóng gói cẩn thận💕 , lần sau ủng hộ tiếp ạ💋💋💋',
    'Predict': 'non-spam'},
   {'Reviews': 'Hàng oke đẹp giá rẻ đế làm bằng cao su cứng bên trên làm bằng da đi êm chân nên mua nha ae',
    'Predict': 'spam'},
   {'Reviews': 'Rất đẹp ạ đi vừa các bạn nên lùi size nhé đi rất đẹp luôn lại còn săn dc giá rẻ',
    'Predict': 'spam'},
   {'Reviews': 'Chất lượng tốt đẹp phù hợp với mọi chân mọi lứa tuổi mọi, người nên mua 1 lần nha 😁😁😁',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp lắm không có gì để chê còn rẻ nữa shop cũng rất nhiệt tình',
    'Predict': 'non-spam'},
   {'Reviews': 'Giao hàng nhanh, đúng size đi vừa đẹp,nói chung là ưng lắm luôn,thank shop',
    'Predict': 'non-spam'},
   {'Reviews': 'dép size 42 nhưng quai rất rộng mong shop sẽ khắc phục (bình luận chỉ mang tính chất nhận xu có pet sôi có pha ban có thể là s á t quên đi dc k có những đứa trẻ có j kh đi làm á Châu tự do Hạnh có nhận thức)',
    'Predict': 'non-spam'},
   {'Reviews': 'Sản phẩm rất tuyệt vời mn nên mua ạ. Mình đặt hộ em trai mà nó đi vừa quá trời,mn nên đặt lên một size nha, em mình ở ngoài đi 39 hơi lỏng mà dép này lên size 40 vừa in luôn. Sản phẩm rất đáng mua nha mn',
    'Predict': 'non-spam'},
   {'Reviews': 'Nhận được hàng ưng lắm lun ý đúng siz với giá tiền như vầy mà đc chất lượng quá oke lun ấy hốt đi mn ko sau này giá lên 😂',
    'Predict': 'spam'},
   {'Reviews': 'sp oke nma có lỗi tí mực ở phần đầu.mới đầu trắng này nma đi 1 tgian bị bẩn ko biết có đánh đc ko nch ổn nên mu',
    'Predict': 'non-spam'},
   {'Reviews': 'Tưởng giao lâu mà nhanh quá ạ, vừa chân nữ, nam đi có lẽ lên 1 size là quá đẹp nhưng như này là ưng lắm rồi nè.',
    'Predict': 'non-spam'},
   {'Reviews': 'Hàng ok trong tầm gia. Mua đi choi di trong nhà cũng tiện.sẽ ủng hộ shop nữa mọi người nên mua',
    'Predict': 'non-spam'},
   {'Reviews': 'Ưng thật sự dép đẹp xĩu mang lên êm chân lắm mhoong có điểm gì để chê cả đáng tiền lắm nên mua nhe',
    'Predict': 'non-spam'},
   {'Reviews': 'Khuyên mọi người mua tăng lên một size con thích đi rộng thì tăng lên hai size nhé khuyên thật lòng￼￼￼￼',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp ok đúng mô tả ảnh 5 sao sản phẩm chất lượng giá như vậy mà dép thế ok rồi',
    'Predict': 'non-spam'},
   {'Reviews': 'Màu sắc:đúng màu\nĐúng với mô tả:ok\n\nGiá cả hợp lý',
    'Predict': 'spam'},
   {'Reviews': 'Đúng với mô tả:dép đúng vs hình\n\nSản phẩm ok',
    'Predict': 'non-spam'},
   {'Reviews': 'Thank ciuu bạn đã tin tưởng ủng hộ và để lại feedback cho shop ạ🥰 Niềm tin b dành cho shop là 1 động lực lớn giúp shop cải thiện ngày một phát triển hơn. Shop chúc b cùng gđ luôn vui tươi, mạnh khoẻ, hạnh phúc và gặp nhiều may mắn nhaaaaa❤️❤️',
    'Predict': 'non-spam'},
   {'Reviews': 'rất đẹp, rẻ, sản phẩm hợp thời trang rất ưng và sẽ ủng hộ shop tiếp nên giữ cẩn thận tránh bị bẩn',
    'Predict': 'non-spam'},
   {'Reviews': 'Đúng với mô tả:b5vỳtdtercvtvtc444c5vtbtv rrvrvvrv44cv4cv44cv44ccvv\nChất liệu:gvcr4c4',
    'Predict': 'spam'},
   {'Reviews': 'Cỡ giày dép là một chỉ thị bằng số và chữ về độ khít của giày dép đối với bàn chân của mỗi người. Thông thường, nó chỉ bao gồm một số chỉ ra độ dài do nhiều nhà sản xuất giày dép chỉ cung cấp một độ dài tiêu chuẩn vì lý do các kinh tế. Có một vài hệ thống kích cỡ giày dép khác nhau được sử dụng trên',
    'Predict': 'non-spam'},
   {'Reviews': 'Hàng của shop mình đã mua và sử dụng thấy rất tốt.Tốt từ chát liệu đến fom dáng,cá bạn lên mua ủng hộ shop nha.Còn về chất lượng phục vụ shop tư vấn size số rất nhiệt tình .Xứng đáng 5 sao',
    'Predict': 'spam'},
   {'Reviews': 'Mua của shop lâu rồi nay mới lên review. Sản phẩm rất đẹp, đóng gói cẩn thận, giao hàng cho bên vận chuyển nhanh. Mình mua về tặng chưa thẩm được chất lượng nhưng nhìn hình thức thì rất oki rồi. Mọi người nên mua của shop nhé. 5 sao cho chất lượng tuyệt vời.',
    'Predict': 'spam'},
   {'Reviews': 'Mình muua size 41 mang rất vừa chân , form dép chuẩm nên k cần tăng size hay lùi size gì cả , về phần quai in rất sắc nét , đế dép mang siêu êm và nhẹ tênh luôn , cảm ơn shop đã cung cấp sảm phẩm tốt với giá cả quá rẻ👍👍👍👍❤❤❤',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp, giáo hàng nhanh chóng, đóng gói cẩn thận . Shop uy tín chất lượng giao đúng hình đúng mẫu . Hài lòng sẽ quay lại ủng hộ shop',
    'Predict': 'spam'},
   {'Reviews': 'Shop giao hàng nhanh chóng Đóng gói kỹ càng, cẩn thận. Sp đúng như shop mô tả. Mình rất ưng sp này và mua cho cả gia đình mình dùng. Cảm ơn shop về sp này, sẽ ủng hộ shop nữa',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp lắm nhé shop ơi, đúng với hình nhé rẻ đẹp đeo khá êm chân, giao hàng nhanh lắm nhé rất ưng ạ lần sau sẽ lji ủng hộ shop ạ',
    'Predict': 'spam'},
   {'Reviews': 'Dép đẹp lắm nhé shop ơi, đúng với hình nhé rẻ đẹp đeo khá êm chân, giao hàng nhanh lắm nhé rất ưng ạ lần sau sẽ lji ủng hộ shop ạ',
    'Predict': 'spam'},
   {'Reviews': 'Giao hàng nhanh, chất lượng tốt, đúng với mô tả, đi nhẹ, êm, vừa in luôn. Rất tốt, hàng đẹp, mình sẽ mua lại vào lần sau, mn nên mua nha',
    'Predict': 'spam'},
   {'Reviews': 'Giao hàng nhanh, chất lượng tốt, đúng với mô tả, đi nhẹ, êm, vừa in luôn. Rất tốt, hàng đẹp, mình sẽ mua lại vào lần sau, mn nên mua nha',
    'Predict': 'spam'},
   {'Reviews': 'Giao hàng nhanh, chất lượng tốt, đúng với mô tả, đi nhẹ, êm, vừa in luôn. Rất tốt, hàng đẹp, mình sẽ mua lại vào lần sau, mn nên mua nha',
    'Predict': 'spam'},
   {'Reviews': 'Sau 2 ngày chờ đợi cuối cùng dép cũng về. Chất lượng dép tuyệt vời.Đi êm không trơn giá cả phải trăng quá xuất sắc luôn , ok la shop',
    'Predict': 'spam'},
   {'Reviews': 'Sau 2 ngày chờ đợi cuối cùng dép cũng về. Chất lượng dép tuyệt vời.Đi êm không trơn giá cả phải trăng quá xuất sắc luôn , ok la shop',
    'Predict': 'spam'},
   {'Reviews': 'Sau 2 ngày chờ đợi cuối cùng dép cũng về. Chất lượng dép tuyệt vời.Đi êm không trơn giá cả phải trăng quá xuất sắc luôn , ok la shop',
    'Predict': 'spam'},
   {'Reviews': 'Giao hàng nhanh. Sản phẩm hơi bị chất lượng lun nha mn. Nhìn rất chắc chắn. Mình mua giá sale 40k 1đôi. Quá là tuyệt vời lun ạk',
    'Predict': 'spam'},
   {'Reviews': 'Mình chụp không đẹp nhưng hàng siêu đẹp nha.với tầm giá này ko tin là mã hàng này nó xinh đến vậy luôn. Quá lag ok , sẽ quay lại mua và ủng hộ nhiều. Shop tư vấn cực nhiệt tình.',
    'Predict': 'spam'},
   {'Reviews': 'Mình chụp không đẹp nhưng hàng siêu đẹp nha.với tầm giá này ko tin là mã hàng này nó xinh đến vậy luôn. Quá lag ok , sẽ quay lại mua và ủng hộ nhiều. Shop tư vấn cực nhiệt tình.',
    'Predict': 'spam'},
   {'Reviews': 'dép phù hợp với giá tiền , chất liệu bằng cao su non đi cực êm luôn ấy, phối đồ đẹp lắm vì dép là mẫu mới , nên rất thích ạ,sẽ mua thêm để ủng hộ shop nha',
    'Predict': 'spam'},
   {'Reviews': 'Giao hàng nhanh, đúng size đi vừa đẹp,nói chung là ưng lắm luôn,thank shop',
    'Predict': 'spam'},
   {'Reviews': 'Nhận được hàng ưng lắm lun ý đúng siz với giá tiền như vầy mà đc chất lượng quá oke lun ấy hốt đi mn ko sau này giá lên 😂',
    'Predict': 'spam'},
   {'Reviews': 'Tưởng giao lâu mà nhanh quá ạ, vừa chân nữ, nam đi có lẽ lên 1 size là quá đẹp nhưng như này là ưng lắm rồi nè.',
    'Predict': 'spam'},
   {'Reviews': 'Tưởng giao lâu mà nhanh quá ạ, vừa chân nữ, nam đi có lẽ lên 1 size là quá đẹp nhưng như này là ưng lắm rồi nè.',
    'Predict': 'spam'},
   {'Reviews': 'Khuyên mọi người mua tăng lên một size con thích đi rộng thì tăng lên hai size nhé khuyên thật lòng￼￼￼￼',
    'Predict': 'spam'},
   {'Reviews': 'Thank ciuu bạn đã tin tưởng ủng hộ và để lại feedback cho shop ạ🥰 Niềm tin b dành cho shop là 1 động lực lớn giúp shop cải thiện ngày một phát triển hơn. Shop chúc b cùng gđ luôn vui tươi, mạnh khoẻ, hạnh phúc và gặp nhiều may mắn nhaaaaa❤️❤️',
    'Predict': 'spam'},
   {'Reviews': 'Cỡ giày dép là một chỉ thị bằng số và chữ về độ khít của giày dép đối với bàn chân của mỗi người. Thông thường, nó chỉ bao gồm một số chỉ ra độ dài do nhiều nhà sản xuất giày dép chỉ cung cấp một độ dài tiêu chuẩn vì lý do các kinh tế. Có một vài hệ thống kích cỡ giày dép khác nhau được sử dụng trên',
    'Predict': 'spam'}];

injectedElement = ce('div', { class: 'spam-preview-and-summary' }, [
  ce('div', { class: 'spam-preview' }),
  ce('div', { class: 'summary' })
]);

// spam preview
table = ce('div', { class: 'spam table' }, [
  ce('span', { class: 'spam table title' }, ['Spam Preview Table']),
], injectedElement.children[0], -1);
table.style.display = 'block';
chart = ce('div', { class: 'spam chart' }, ['Spam Proportion Chart'], injectedElement.children[0], -1);
chart.style.display = 'none';

icon1 = ce('i', { class: 'fas fa-table'}, [], injectedElement.children[0], -1);
icon1.addEventListener('click', () => {
  table.style.display = 'block';
  chart.style.display = 'none';
});

icon2 = ce('i', { class: 'fas fa-chart'}, [], injectedElement.children[0], -1);
icon2.addEventListener('click', () => {
  table.style.display = 'none';
  chart.style.display = 'block';
});

const table_ = createTableFromJSON(jsonData);
table.appendChild(table_);

pieChartJS({"spam":44, "non-spam":55}, chart);

// summary
summary = ce('div', { class: 'summary-box' }, [
  ce('span', { class: 'summary-box title' }, ['Summary']),
], injectedElement.children[1], -1);

summaryDisplay = ce('div', { class: 'summary-box display' }, [], summary, -1);



document.body.appendChild(injectedElement);

