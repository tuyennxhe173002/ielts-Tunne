# **1\) Mục tiêu hệ thống**

Xây dựng một website học tập giúp:

* Quản lý nhiều khóa học theo nhiều nhóm ngôn ngữ và môn học.  
* Kiểm soát chặt việc đăng ký tài khoản bằng Google.  
* Chỉ cho phép học viên học thử ngày đầu tiên khi chưa được mở quyền khóa học.  
* Mỗi khóa học có lộ trình học theo ngày.  
* Học viên có thể xem bài giảng, làm bài tập, nộp bài, bình luận hỏi đáp.  
* Giáo viên có thể quản lý nội dung giảng dạy và phản hồi học viên.  
* Admin/quản lý học viên có thể duyệt tài khoản, cấp quyền khóa học, quản lý thanh toán và vận hành toàn bộ hệ thống.

---

# **2\) Các role trong hệ thống**

## **2.1. Guest**

Là người chưa đăng nhập.

### **Quyền chính**

* Xem trang chủ.  
* Xem danh sách khóa học.  
* Xem thông tin giới thiệu từng khóa học.  
* Xem mức giá khóa học.  
* Xem một phần nội dung học thử nếu hệ thống cho phép public.  
* Nhấn đăng nhập bằng Google.

### **Không được phép**

* Không được học đầy đủ.  
* Không được nộp bài tập.  
* Không được bình luận.  
* Không được mua khóa học nếu chưa có tài khoản hợp lệ trong hệ thống.

---

## **2.2. Student**

Là học viên đã đăng nhập bằng Google và đã được hệ thống/admin cho phép tạo tài khoản.

### **Quyền chính**

* Đăng nhập bằng tài khoản Google.  
* Xem tất cả các khóa học hiện có.  
* Với khóa học chưa được cấp quyền:  
  * chỉ thấy trạng thái **khóa**,  
  * chỉ được xem **học thử ngày đầu tiên**.  
* Với khóa học đã được cấp quyền:  
  * xem video bài giảng,  
  * tải tài liệu,  
  * nghe audio,  
  * làm bài tập,  
  * nộp bài tập,  
  * bình luận dưới từng bài học/video,  
  * theo dõi tiến độ học theo ngày.  
* Mua khóa học.  
* Xem hướng dẫn chuyển khoản.  
* Nhận thông báo sau khi bấm thanh toán.

### **Không được phép**

* Không được tự mở khóa học.  
* Không được sửa nội dung khóa học.  
* Không được xóa bình luận của người khác.  
* Không được quản trị bài tập hoặc dữ liệu người dùng khác.

---

## **2.3. Giáo viên**

Là người phụ trách nội dung giảng dạy.

### **Quyền chính**

* Đăng nhập bằng tài khoản giáo viên.  
* Được quản lý nội dung các khóa học được phân công:  
  * thêm/sửa/xóa bài giảng,  
  * thêm/sửa/xóa tài liệu,  
  * thêm/sửa/xóa audio,  
  * thêm/sửa/xóa bài tập,  
  * tạo nội dung bài tập để học viên làm trực tiếp trong hệ thống,  
  * xem bài nộp của học viên,  
  * phản hồi/chấm/nhận xét bài làm,  
  * trả lời comment/thắc mắc của học viên dưới từng bài giảng.  
* Theo dõi danh sách học viên trong khóa học mình phụ trách.

### **Không được phép**

* Không được quản lý toàn bộ hệ thống như admin.  
* Không được duyệt tài khoản Google mới.  
* Không được quản lý thanh toán toàn hệ thống trừ khi được phân quyền riêng.  
* Không được chỉnh sửa khóa học ngoài phạm vi được giao.

---

## **2.4. Quản lý học viên**

Role trung gian giữa admin và học viên, thiên về vận hành/chăm sóc học viên.

### **Quyền chính**

* Xem danh sách học viên.  
* Xem trạng thái tài khoản học viên:  
  * chờ duyệt,  
  * đang hoạt động,  
  * bị khóa.  
* Xem trạng thái khóa học của từng học viên:  
  * chưa mua,  
  * chờ thanh toán,  
  * chờ xác minh,  
  * đã mở quyền.  
* Hỗ trợ xử lý đơn mua khóa học.  
* Nhận/tham chiếu ảnh chuyển khoản do học viên gửi qua nhân viên tư vấn.  
* Cập nhật trạng thái xác minh thanh toán.  
* Đề xuất hoặc thực hiện mở quyền khóa học nếu được admin phân quyền.  
* Theo dõi tiến độ học tập, nhắc học viên, hỗ trợ chăm sóc sau bán.

### **Không được phép**

* Không nên có toàn quyền hệ thống như admin nếu chưa được phân quyền.  
* Không được thay đổi cấu hình hệ thống cốt lõi.  
* Không được sửa nội dung bài giảng nếu không phải giáo viên/admin.

---

## **2.5. Admin**

Là người có quyền cao nhất.

### **Quyền chính**

* Quản lý toàn bộ hệ thống.  
* Duyệt hoặc từ chối tài khoản mới đăng nhập bằng Google.  
* Tạo/sửa/xóa khóa học.  
* Tạo/sửa/xóa danh mục khóa học.  
* Quản lý lộ trình học theo ngày.  
* Quản lý toàn bộ bài học, tài liệu, bài tập, audio, video.  
* Quản lý tất cả user và phân quyền role.  
* Quản lý thanh toán, xác minh, cấp quyền học.  
* Quản lý comment, phản hồi, khiếu nại.  
* Xem báo cáo và thống kê hệ thống.  
* Khóa/mở tài khoản.  
* Khóa/mở khóa học cho từng học viên.  
* Gán giáo viên vào từng khóa học.

---

# **3\) Đặc tả chức năng theo nghiệp vụ**

# **3.1. Đăng nhập và tạo tài khoản bằng Google**

## **Mô tả**

Người dùng đăng nhập website bằng tài khoản Google. Tuy nhiên, không phải ai đăng nhập cũng được sử dụng ngay. Hệ thống chỉ tạo tài khoản chính thức khi **admin phê duyệt**.

## **Luồng nghiệp vụ**

1. Guest nhấn **Đăng nhập bằng Google**.  
2. Hệ thống xác thực Google thành công.  
3. Nếu email chưa tồn tại trong hệ thống:  
   * tạo bản ghi ở trạng thái **Chờ duyệt**.  
   * hiển thị thông báo:  
      **“Tài khoản của bạn đang chờ admin phê duyệt. Bạn sẽ được sử dụng hệ thống sau khi được xác nhận.”**  
4. Admin/Quản lý học viên vào danh sách tài khoản chờ duyệt.  
5. Admin duyệt hoặc từ chối.  
6. Sau khi duyệt:  
   * user mới được đăng nhập vào hệ thống với role phù hợp.

## **Trạng thái tài khoản**

* Chờ duyệt  
* Đã duyệt  
* Bị từ chối  
* Bị khóa

---

# **3.2. Hiển thị danh sách khóa học sau khi đăng nhập**

## **Mô tả**

Sau khi đăng nhập, học viên nhìn thấy toàn bộ khóa học của hệ thống, gồm các nhóm như:

* IELTS  
* TOEIC  
* TOPIK  
* Tiếng Nhật  
* Tiếng Trung  
* Các môn học đại học

## **Quy tắc hiển thị**

* Tất cả khóa học đều hiển thị trên dashboard.  
* Với khóa học học viên chưa được mở quyền:  
  * hiển thị nhãn **Khóa** hoặc **Chưa mở quyền**.  
  * vẫn được bấm vào để xem thông tin chi tiết khóa học.  
  * chỉ được học thử **ngày đầu tiên**.  
* Với khóa học đã được mở quyền:  
  * hiển thị nhãn **Đang học** hoặc **Đã mở**.

## **Bộ lọc nên có**

* Lọc theo danh mục  
* Tìm kiếm theo tên khóa học  
* Lọc theo trạng thái: đã mua / chưa mua / đang học / hoàn thành

---

# **3.3. Chi tiết khóa học**

## **Khi học viên bấm vào từng khóa học**

Hệ thống mở trang chi tiết khóa học gồm:

### **Thông tin chung**

* Tên khóa học  
* Mô tả khóa học  
* Mục tiêu đầu ra  
* Đối tượng phù hợp  
* Giá khóa học  
* Tổng số ngày học  
* Tổng số bài học  
* Giáo viên phụ trách  
* Trạng thái khóa học:  
  * chưa mở quyền  
  * đã mở quyền

### **Danh sách lộ trình học theo ngày**

Ví dụ:

* IELTS 48 ngày  
* TOEIC 30 ngày  
* TOPIK 60 ngày

Mỗi ngày học hiển thị:

* Ngày số mấy  
* Tên chủ đề  
* Trạng thái:  
  * học thử  
  * khóa  
  * đã mở  
  * đã hoàn thành

## **Quy tắc truy cập**

* Nếu chưa mua khóa:  
  * chỉ xem được **Ngày 1**  
  * các ngày còn lại hiển thị khóa  
* Nếu đã mua và được cấp quyền:  
  * xem được toàn bộ theo phạm vi đã mở

---

# **3.4. Trang học theo từng ngày**

Mỗi ngày học là một đơn vị nội dung riêng.

## **Thành phần trong một ngày học**

* Video bài giảng  
* Tài liệu đính kèm  
* File audio  
* Bài tập thực hành  
* Form nộp bài tập  
* Khu vực comment hỏi đáp

## **Chi tiết chức năng**

### **a) Video bài giảng**

* Hiển thị video chính của ngày học.  
* Có tiêu đề, mô tả ngắn.  
* Học viên chỉ xem được nếu có quyền.  
* Comment được gắn theo bài học/video cụ thể.

### **b) Tài liệu**

* File PDF, Word, slide, hình ảnh...  
* Học viên được tải hoặc xem online theo quyền.

### **c) Audio**

* Có trình phát audio trực tiếp.  
* Có thể tải về nếu admin cho phép.

### **d) Bài tập**

Có 2 dạng:

1. **Bài tập làm trực tiếp trên hệ thống**  
   * câu hỏi trắc nghiệm / tự luận / điền đáp án  
2. **Bài tập nộp file**  
   * upload file Word/PDF/ảnh/audio

### **e) Nộp bài**

* Học viên nộp bài theo từng ngày học.  
* Có trạng thái:  
  * chưa nộp  
  * đã nộp  
  * cần sửa  
  * đã chấm  
* Giáo viên phản hồi trực tiếp trên bài nộp.

### **f) Comment hỏi đáp**

* Học viên comment phần chưa hiểu dưới video bài giảng.  
* Giáo viên/admin có thể trả lời.  
* Nên hỗ trợ:  
  * reply theo luồng  
  * đánh dấu đã giải đáp  
  * thông báo khi có phản hồi mới

---

# **3.5. Học thử ngày đầu tiên**

## **Mục tiêu**

Cho người dùng trải nghiệm trước khi mua.

## **Quy tắc**

* Tất cả user đã được duyệt tài khoản đều có thể xem học thử **Ngày 1** của mọi khóa học.  
* Các ngày còn lại bị khóa.  
* Ở các ngày bị khóa hiển thị nút **Mua khóa học**.  
* Nếu user chưa đăng nhập thì có thể cho xem mô tả khóa học, còn học thử có thể yêu cầu đăng nhập trước.

---

# **3.6. Mua khóa học và thanh toán**

## **Mô tả**

Hệ thống không thanh toán tự động online, mà thanh toán bằng **chuyển khoản**.

## **Luồng mua khóa học**

1. Học viên bấm **Mua khóa học**.  
2. Hệ thống mở trang thanh toán.  
3. Hiển thị thông tin chuyển khoản:  
   * số tài khoản  
   * tên ngân hàng  
   * chủ tài khoản  
   * nội dung chuyển khoản gợi ý  
   * số tiền  
4. Sau khi học viên xác nhận đã chuyển khoản, hiển thị thông báo:

**“Bạn vui lòng gửi ảnh chuyển khoản đến nhân viên tư vấn để được mở quyền khóa học.”**

5. Đơn hàng chuyển sang trạng thái:  
   * chờ gửi minh chứng  
   * chờ xác minh  
6. Quản lý học viên/admin kiểm tra và cấp quyền.

## **Trạng thái đơn hàng**

* Khởi tạo  
* Chờ thanh toán  
* Chờ xác minh  
* Đã xác minh  
* Đã mở khóa học  
* Từ chối / thanh toán lỗi

---

# **3.7. Cấp quyền khóa học sau thanh toán**

## **Mô tả**

Sau khi thanh toán chuyển khoản được xác minh, admin hoặc quản lý học viên cấp quyền học cho user.

## **Sau khi cấp quyền**

Học viên có thể:

* xem video bài giảng,  
* xem/tải tài liệu,  
* làm bài tập,  
* nộp bài tập,  
* comment dưới từng video bài giảng.

## **Quyền cấp có thể theo nhiều mức**

Nên thiết kế hỗ trợ:

* Mở toàn bộ khóa học  
* Mở theo từng giai đoạn  
* Mở có thời hạn  
* Thu hồi quyền nếu cần

---

# **3.8. Quản lý khóa học**

## **Admin có thể**

* Thêm khóa học mới  
* Sửa thông tin khóa học  
* Xóa khóa học  
* Bật/tắt hiển thị khóa học  
* Gán giáo viên phụ trách  
* Cài đặt số ngày học  
* Cài đặt học thử ngày 1  
* Cài đặt giá khóa học

## **Cấu trúc khóa học**

* Danh mục khóa học  
* Khóa học  
* Ngày học  
* Nội dung trong từng ngày

Ví dụ:

* Danh mục: IELTS  
* Khóa học: IELTS 6.5 cấp tốc  
* Số ngày: 48  
* Mỗi ngày có:  
  * video  
  * tài liệu  
  * bài tập  
  * comment

---

# **3.9. Quản lý nội dung bài học**

## **Admin/Giáo viên có thể**

* Thêm ngày học  
* Sửa tên ngày học  
* Sắp xếp thứ tự ngày học  
* Thêm video  
* Thêm file bài giảng  
* Thêm tài liệu  
* Thêm audio  
* Tạo bài tập  
* Sửa/xóa mọi nội dung

## **Yêu cầu chi tiết**

Mỗi ngày học nên có:

* mã ngày học  
* tiêu đề  
* mô tả  
* video chính  
* tài liệu đính kèm  
* audio  
* bài tập  
* hạn nộp (nếu có)  
* trạng thái hiển thị

---

# **3.10. Quản lý bài tập và chấm bài**

## **Cho học viên**

* Làm bài trực tiếp trên web  
* Nộp file bài tập  
* Xem trạng thái bài nộp  
* Xem phản hồi của giáo viên

## **Cho giáo viên/admin**

* Tạo nhiều loại bài tập:  
  * trắc nghiệm  
  * tự luận  
  * upload file  
* Chấm điểm  
* Nhận xét  
* Yêu cầu làm lại  
* Đánh dấu hoàn thành

## **Trạng thái bài tập**

* Chưa làm  
* Đang làm  
* Đã nộp  
* Đã chấm  
* Cần nộp lại

---

# **3.11. Bình luận và giải đáp**

## **Học viên**

* Comment dưới từng video/bài học.  
* Có thể hỏi phần chưa hiểu.

## **Giáo viên/Admin**

* Trả lời comment.  
* Chỉnh sửa/xóa comment nếu cần.  
* Đánh dấu comment đã được giải đáp.

## **Nên có thêm**

* Thông báo khi có người trả lời comment.  
* Lọc comment chưa trả lời.  
* Ghim câu hỏi quan trọng.

---

# **3.12. Quản lý người dùng và phân quyền**

## **Admin**

* Tạo/sửa/xóa user  
* Gán role:  
  * admin  
  * giáo viên  
  * student  
  * guest  
  * quản lý học viên  
* Khóa/mở tài khoản  
* Xem lịch sử truy cập cơ bản  
* Gán khóa học cho học viên

## **Quản lý học viên**

* Xem hồ sơ học viên  
* Xem tình trạng khóa học của học viên  
* Hỗ trợ mở quyền học khi được phân quyền

---

# **3.13. Dashboard theo role**

## **Guest dashboard**

* Trang giới thiệu  
* Danh sách khóa học  
* Đăng nhập Google

## **Student dashboard**

* Danh sách tất cả khóa học  
* Khóa đã mua  
* Khóa chưa mua  
* Tiến độ học tập  
* Thông báo mới  
* Bài tập cần nộp

## **Giáo viên dashboard**

* Các khóa học phụ trách  
* Bài tập chờ chấm  
* Comment chờ trả lời  
* Thống kê học viên theo khóa

## **Quản lý học viên dashboard**

* Tài khoản chờ duyệt  
* Đơn hàng chờ xác minh  
* Học viên cần hỗ trợ  
* Danh sách học viên theo trạng thái

## **Admin dashboard**

* Tổng số user  
* Tổng số khóa học  
* Đơn hàng chờ xử lý  
* Tài khoản chờ duyệt  
* Báo cáo doanh thu cơ bản  
* Báo cáo học viên theo khóa học

---

# **4\) Phân quyền tổng hợp theo role**

## **Guest**

* Xem khóa học: Có  
* Xem chi tiết khóa học: Có  
* Đăng nhập Google: Có  
* Học thử: Có thể cho phép hạn chế  
* Mua khóa học: Không hoặc cần đăng nhập trước

## **Student**

* Xem tất cả khóa học: Có  
* Xem ngày 1 học thử: Có  
* Xem đầy đủ khóa đã mở quyền: Có  
* Làm/nộp bài tập: Có  
* Comment: Có  
* Mua khóa học: Có

## **Giáo viên**

* Quản lý bài giảng: Có  
* Quản lý bài tập: Có  
* Chấm bài: Có  
* Trả lời comment: Có  
* Quản lý user hệ thống: Không

## **Quản lý học viên**

* Duyệt/hỗ trợ tài khoản: Có thể có  
* Theo dõi học viên: Có  
* Xử lý đơn thanh toán: Có  
* Mở quyền khóa học: Có thể có theo phân quyền  
* Sửa nội dung khóa học: Không

## **Admin**

* Toàn quyền: Có

---

# **5\) Các màn hình chính cần có**

* Trang chủ  
* Trang đăng nhập Google  
* Trang chờ duyệt tài khoản  
* Trang danh sách khóa học  
* Trang chi tiết khóa học  
* Trang học theo từng ngày  
* Trang làm bài tập  
* Trang nộp bài tập  
* Trang thanh toán chuyển khoản  
* Trang thông báo chờ xác minh thanh toán  
* Trang quản lý comment  
* Trang quản lý học viên  
* Trang quản lý giáo viên  
* Trang quản lý khóa học  
* Trang admin dashboard

---

# **6\) Dữ liệu chính cần quản lý**

* Người dùng  
* Vai trò  
* Danh mục khóa học  
* Khóa học  
* Lộ trình theo ngày  
* Bài học/video  
* Tài liệu/audio  
* Bài tập  
* Bài nộp  
* Bình luận  
* Đơn mua khóa học  
* Trạng thái thanh toán  
* Quyền truy cập khóa học

---

# **7\) Các quy tắc nghiệp vụ quan trọng**

## **Quy tắc 1**

Người dùng đăng nhập bằng Google **chưa được sử dụng ngay**, phải chờ admin duyệt.

## **Quy tắc 2**

Sau khi đăng nhập, học viên được nhìn thấy **toàn bộ khóa học**, nhưng mặc định ở trạng thái **khóa**.

## **Quy tắc 3**

Khóa học chưa mua chỉ được xem **học thử ngày đầu tiên**.

## **Quy tắc 4**

Mỗi khóa học có **lộ trình theo ngày**, ví dụ 48 ngày.

## **Quy tắc 5**

Sau khi học viên bấm mua khóa học, hệ thống chỉ hỗ trợ **chuyển khoản thủ công**.

## **Quy tắc 6**

Sau chuyển khoản, hệ thống phải hiện thông báo:  
 **“Bạn vui lòng gửi ảnh chuyển khoản đến nhân viên tư vấn để được mở quyền khóa học.”**

## **Quy tắc 7**

Chỉ khi admin/quản lý học viên cấp quyền thì học viên mới:

* xem full video,  
* nộp bài tập,  
* comment toàn bộ bài học.

## **Quy tắc 8**

Giáo viên chỉ được quản lý nội dung giảng dạy trong phạm vi được phân công.

---

# **8\) Đề xuất bổ sung để website “dễ dùng và quản lý hơn”**

Ngoài yêu cầu hiện tại, để hệ thống dễ vận hành hơn, nên bổ sung:

## **Cho người học**

* Hiển thị tiến độ học theo %.  
* Đánh dấu đã học xong từng ngày.  
* Nhắc bài tập chưa nộp.  
* Lưu bài đang làm dở.  
* Thông báo khi giáo viên trả lời comment.

## **Cho giáo viên**

* Danh sách comment chưa trả lời.  
* Danh sách bài tập chưa chấm.  
* Bộ lọc theo khóa học/ngày học/học viên.

## **Cho admin/quản lý học viên**

* Bộ lọc tài khoản chờ duyệt.  
* Bộ lọc đơn hàng chờ xác minh.  
* Nhật ký thao tác mở quyền khóa học.  
* Báo cáo số học viên theo từng khóa.  
* Xuất danh sách học viên ra Excel.

