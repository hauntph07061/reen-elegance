import { useState, useEffect } from 'react';
import LegalPage from './LegalPage';

export const DeliveryPolicy = () => (
  <LegalPage title="Chính Sách Giao Nhận" lastUpdated="15/10/2025">
    <h2>1. Phạm vi giao hàng</h2>
    <p>Green Elegance cung cấp dịch vụ giao hoa tận nơi tại nội thành TP.HCM và Hà Nội. Các khu vực ngoại thành có thể phát sinh thêm phụ phí (sẽ được thông báo cụ thể khi xác nhận đơn).</p>
    
    <h2>2. Thời gian giao hàng</h2>
    <ul>
      <li><strong>Giao hỏa tốc:</strong> Trong vòng 2 giờ kể từ khi xác nhận thanh toán thành công (chỉ áp dụng với một số mẫu hoa có sẵn).</li>
      <li><strong>Giao theo yêu cầu:</strong> Quý khách có thể chọn khung giờ (8:00 - 21:00) theo các ca cách nhau 2 tiếng.</li>
    </ul>

    <h2>3. Phí vận chuyển</h2>
    <p>Miễn phí giao hàng (Freeship) cho toàn bộ đơn hàng có giá trị thanh toán <strong>từ 500,000đ trở lên</strong>. Với đơn hàng dưới mức này, phụ phí cố định là 30,000đ.</p>
    
    <h2>4. Lưu ý khi nhận hàng</h2>
    <p>Người nhận vui lòng kiểm tra kỹ số lượng, chất lượng hoa và thiệp trước khi ký nhận. Chúng tôi sẽ có ảnh chụp minh chứng lúc hoa được giao thành công.</p>
  </LegalPage>
);

export const ReturnPolicy = () => (
  <LegalPage title="Chính Sách Đổi Trả" lastUpdated="20/11/2025">
    <h2>1. Điều kiện áp dụng</h2>
    <p>Đặc thù là sản phẩm nông nghiệp và có vòng đời ngắn, chúng tôi chỉ hỗ trợ xử lý đổi trả trong các trường hợp sau:</p>
    <ul>
      <li>Hoa bị dập nát, gãy cành, héo úa nghiêm trọng do lỗi của quá trình vận chuyển.</li>
      <li>Thiết kế hoa thực tế khác biệt quá 30% so với hình ảnh mẫu hoặc sai tone màu chủ đạo đã chốt.</li>
      <li>Sản phẩm được giao không đúng với đơn đặt hàng.</li>
    </ul>

    <h2>2. Thời gian khiếu nại</h2>
    <p>Quý khách vui lòng cung cấp video/hình ảnh tình trạng hoa và gửi về Hotline/Zalo ngay trong vòng <strong>2 giờ</strong> kể từ thời điểm nhận hoa. Quá thời gian này, chúng tôi xin phép từ chối giải quyết khiếu nại.</p>
    
    <h2>3. Phương thức giải quyết</h2>
    <p>Nếu lỗi thuộc về hệ thống, Green Elegance sẽ thu hồi chậu hoa cũ và giao chậu mới thay thế trong thời gian sớm nhất, hoặc hoàn tiền 100% qua tài khoản ngân hàng của quý khách.</p>
  </LegalPage>
);

export const PrivacyPolicy = () => (
  <LegalPage title="Chính Sách Bảo Mật" lastUpdated="01/01/2026">
    <h2>1. Mục đích thu thập</h2>
    <p>Hệ thống chỉ thu thập thông tin cơ bản (Họ tên, SĐT, Email, Địa chỉ) để xử lý đơn hàng, liên hệ giao nhận và gửi các ưu đãi đặc quyền cho khách hàng thân thiết.</p>
    
    <h2>2. Phạm vi sử dụng</h2>
    <p>Thông tin của quý khách chỉ được lưu hành nội bộ và cung cấp một phần cần thiết cho đối tác vận chuyển thứ ba (nhằm mục đích giao hàng).</p>

    <h2>3. Cam kết bảo mật tuyệt đối</h2>
    <p>Green Elegance cam kết tuân thủ nghiêm ngặt các quy định về an toàn dữ liệu. Chúng tôi tuyệt đối <strong>không mua bán, trao đổi hoặc rò rỉ</strong> thông tin cá nhân của bạn cho bất kỳ tổ chức thương mại nào khác.</p>
  </LegalPage>
);

export const PurchasePolicy = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if (data.purchase_policy) {
            setContent(data.purchase_policy);
          }
        } else if (Array.isArray(data)) {
          const item = data.find(i => i.settingKey === 'purchase_policy');
          if (item && item.settingValue) {
            setContent(item.settingValue);
          }
        }
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <LegalPage title="Chính sách mua hàng và đổi trả">
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p className="text-center text-[#5a5a5a] py-10">Đang tải nội dung chính sách...</p>
      )}
    </LegalPage>
  );
};
