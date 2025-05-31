# cf-workers-nav
✨一个部署在CF的轻量化导航页面，可移动卡片式书签，方便管理
### 原作者项目地址：https://github.com/hmhm2022/Card-Tab ，请给原作者点星星

在原项目基础上进行了一些修改：
- 稍微调整UI，优化移动端显示
- 卡片增加简介和自定义icon，增加卡片编辑功能
- 分类支持改名和顺序调整
- 增加导出数据
- 数据去掉links，只保留categories，减少数据量
- token改为JWT
- 其他一些调整

演示动画（⬇️ 请等待加载完成⬇️）
![gif](https://github.com/user-attachments/assets/6d46222a-8069-44c0-9a08-35cdabde4005)


黑暗主题
![dark-theme](https://github.com/user-attachments/assets/6fa53828-cb7c-461e-8ad9-98401d860799)

# 部署方法：
#### 五步即可完成部署：
#### 1. 登录 Cloudflare：  https://www.cloudflare.com  创建workers，复制workers.js的代码，然后部署
![image](https://github.com/user-attachments/assets/c067105b-91ee-43d5-90a9-806e5de5fe16)

#### 2. 新建一个名为CARD_ORDER的KV存储
![image](https://github.com/user-attachments/assets/706a7735-b47a-4f66-bdb4-827c38be692b)

#### 3. 添加环境变量，用于设置后台管理密码。变量名为ADMIN_PASSWORD，值your_password换成你自己的密码
![image](https://github.com/user-attachments/assets/532dcb8f-dc30-4ca9-aac9-21ef546bf367)

#### 4. 将workers的CARD_ORDER变量与新建的KV存储绑定，用于存储书签
![image](https://github.com/user-attachments/assets/9b166809-5b1e-451e-be99-253f6e60be54)

#### 5. 添加域名
![image](https://github.com/user-attachments/assets/4f23eab6-e94c-49b1-9198-3c8e05dffa8a)
