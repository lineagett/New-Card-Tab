<div align="center">
  <h1>cf-workers-nav  个人导航页</h1>
  <p>
    一个部署在CF的轻量化导航页
    <br />
    <i>⚡ 轻松创建属于自己的导航主页</i>
  </p>
</div>

📋 轻松部署的个人导航页 

> 一个部署在CF的轻量化导航页面，可移动卡片式书签，方便管理。
> 原作者项目地址：https://github.com/hmhm2022/Card-Tab ，请给原作者点星星。

## 功能特点
- 🎨 简洁的界面设计
- 📱 响应式布局，支持移动端
- 🔍 支持本站搜索功能
- 🌐 集成Google、Bing、百度等外部搜索引擎
- 🎯 分类展示网站链接
- 🧩 支持喜好保存
- 📚 支持拖动卡片排序
- 🔄 直接部署到cloudflare workers上，简单便捷

## 近期更新

<details>
<summary>点击查看/隐藏更新日志</summary>

### 2025/06/3
- ✅ 支持隐藏分类
- ✅ 数据格式调整，兼容原有数据，为了防止万一请提前备份数据
### 2025/05/09
- ✅ 调整登录UI，支持偏好保存（默认搜索及主题）
- ✅ 增加搜索本站
- ✅ 同步作者修复备份数据认证问题
### 2025/04/25
**在原项目基础上做了以下调整**
- ✅稍微调整UI，优化移动端显示
- ✅卡片增加简介和自定义icon，增加卡片编辑功能
- ✅分类支持改名和顺序调整
- ✅增加导出数据
- ✅token调整为JWT
- ✅数据去掉links，只保留categories，减少数据量
- ✅其他一些调整

</details>

## 界面预览

<details>
<summary>点击展开</summary>
  
### PC端UI
|正常模式|黑暗模式 |
|-|-|
| ![image](https://github.com/user-attachments/assets/e5d5c4ec-3095-4491-af91-c2c0b5013026)| ![image](https://github.com/user-attachments/assets/bd28d48d-d443-4ad4-8e54-b82c69d952db)|
### 移动端UI
|正常模式|黑暗模式 |
|-|-|
| ![image](https://github.com/user-attachments/assets/12451eb3-e32a-4531-99b4-bc2a5db96e0c) | ![image](https://github.com/user-attachments/assets/93e820af-64fa-4faa-bfb3-e42061dec21e)|

</details>

## 部署方式

### 部署到Cloudflare

<details>
<summary>点击展开</summary>

#### 部署步骤

1. 登录 [Cloudflare](https://www.cloudflare.com):
   - 创建workers，复制仓库里workers.js的代码，然后点击部署

2. 创建KV存储:
   - 新建一个名为CARD_ORDER的KV存储，用于存储数据

3. 添加环境变量:
   - 变量名称为ADMIN_PASSWORD，值为你设置的管理密码

4. 绑定KV命名空间
   - 变量名称为CARD_ORDER，KV选择之前创建好的CARD_ORDER

5. 添加域名

</details>


