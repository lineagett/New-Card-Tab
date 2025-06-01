const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Tab</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>⭐</text></svg>">
    <style>
        /* 全局样式 */
        body {
            display: flex;
            flex-direction: column;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f6f2;
            transition: background-color 0.3s ease;
        }

        /* 暗色模式样式 */
        body.dark-theme {
            background-color: #121418; /* 更深的背景色 */
            color: #e3e3e3;
        }
        
        /* 固定元素样式 */
        .fixed-elements {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f8f6f2;
            padding: 0 20px;
            position: fixed;
            width: 100%;
            box-sizing: border-box;
            z-index: 800;
        }
        .fixed-elements h3 {
            margin: 10px
        }

        body.dark-theme .fixed-elements {
            background-color: #121418; /* 与暗色主题背景完全一致 */
            box-shadow: none; /* 移除阴影 */
        }

        /* 分类快捷按钮容器样式移至搜索栏内 */

        .category-button {
            padding: 5px 10px;
            border-radius: 15px;
            background-color: #f9fafb;
            color: #43b883;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
            flex: 0 0 auto;
            white-space: nowrap;
            margin: 0 2px;
            position: relative;
            overflow: hidden;
        }

        body.dark-theme .category-button {
            background-color: #2a2e38;
            color: #5d7fb9;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* 分类按钮选中效果 */
        .category-button.active {
            background-color: #43b883;
            color: white;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
            transform: translateY(-1px);
            font-weight: 600;

        }

        body.dark-theme .category-button.active {
            background-color: #5d7fb9;
            color: white;
        }

        body.dark-theme .fixed-elements h3 {
            color: #e3e3e3;
        }

        .top-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            height: auto; 
            width: 100%;
        }
        
        /* 中心内容样式 */
        .search-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: none;
            width: 100%;
            max-width: 600px;
            text-align: center;
        }
        
        /* 管理员控制面板样式 */
        .admin-controls {
            position: relative;
            display: flex;
            align-items: center;
            gap: 1em;
        }

        .admin-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background-color: #43b883;
            color: white;
            font-size: 14px;
            height: 2em; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer;
            transition: background 0.3s, transform 0.3s; 
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
            position: relative;
        }

        .admin-btn.padding {
            padding: 0 10px; 
        }

        .admin-btn.no-pointer {
            cursor: default;
        }

        .admin-btn svg {
            width: 23px;
            height: 23px;
            display: block;
        }

        .admin-btn::before {
            display: inline-block;
            width: 18px;
            height: 18px;
            margin-right: 0.5em;
            vertical-align: middle;
            background-size: contain;    /* 或 cover */
            background-repeat: no-repeat;
            background-position: center;
            font-size: inherit; 
            margin-bottom: 3px;
        }

        /* 登录状态图标 */
        .admin-btn[data-state="login"]::before {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m10 17 5-5-5-5'/%3E%3Cpath d='M15 12H3'/%3E%3Cpath d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'/%3E%3C/svg%3E");
        }

        /* 退出状态图标 */
        .admin-btn[data-state="logout"]::before {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m16 17 5-5-5-5'/%3E%3Cpath d='M21 12H9'/%3E%3Cpath d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/%3E%3C/svg%3E");
        }

        /* 设置状态图标 */
        .admin-btn[data-state="setting"]::before {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E");
        }

        body.dark-theme .admin-btn {
            background-color: #5d7fb9;
        }

        .admin-a {
            vertical-align: middle;
        }

        .admin-a svg {
            width: 28px;
            height: 28px;
            fill: #43b883;
        }

        body.dark-theme .admin-a svg {
            fill: #5d7fb9;
        }

        .add-card-btn { order: 1; }
        .edit-card-mode-btn { order: 2; }
        .add-category-btn { order: 3; }
        .edit-category-mode-btn { order: 4; }
		.export-data-btn { order: 5; }
        
        /* 设置面板样式 */
        .setting-panel {
            display: none;
            flex-direction: column;
            position: fixed;
            right: 20px;
            top: 40%;
            transform: translateY(-50%);
            align-items: center;
            gap: 8px;
            z-index: 900;
        }
        
        .round-btn {
            background-color: #43b883;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            position: relative;
        }

        .round-btn svg{
            pointer-events: none;
            display: block;
            margin: auto;
        }

        body.dark-theme .round-btn {
            background-color: #5d7fb9;
        }

        /* 主要内容区域样式 */
        .content {
            margin-top: 160px;
            padding: 20px;
        }
        
        /* 搜索栏样式 */
        .search-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .search-bar {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border: 1px solid #e0e0e0;
            transition: all 0.3s ease;
            border-radius: 24px;
            overflow: hidden;
        }

        .search-bar:focus-within {
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
            border-color: #43b883;
        }

        .search-bar select {
            border: none;
            background-color: #f4f7fa;
            padding: 10px 15px;
            font-size: 14px;
            color: #43b883;
            width: 80px;
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%2343b883" d="M0 0l6 6 6-6z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 0;
        }

        /* 下拉菜单样式 */
        select option {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%2343b883" d="M0 0l6 6 6-6z"/></svg>');
            padding: 10px;
            font-size: 14px;
            white-space: nowrap;
            overflow: visible;
        }

        /* 暗色主题搜索栏样式 */
        body.dark-theme .search-bar {
            border-color: #323642;
            background-color: #1e2128;
        }

        body.dark-theme .search-bar select {
            background-color: #252830;
            color: #e3e3e3;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%235d7fb9" d="M0 0l6 6 6-6z"/></svg>');
        }

        body.dark-theme .search-bar input {
            background-color: #252830 !important;
            color: #e3e3e3;
        }

		body.dark-theme .search-bar input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0 1000px #252830 inset !important;
			-webkit-text-fill-color: #e3e3e3 !important;
			transition: background-color 5000s ease-in-out 0s !important;
		}

		body.dark-theme .search-bar input:-moz-autofill {
			box-shadow: 0 0 0px 1000px #252830 inset !important;
			-moz-text-fill-color: #e3e3e3 !important;
		}

        body.dark-theme .search-bar button {
            background-color: #5d7fb9;
        }

        body.dark-theme select option {
            background-color: #252830;
            color: #e3e3e3;
            white-space: nowrap;
            overflow: visible;
        }

        .search-bar input {
            flex: 1;
            border: none;
            padding: 10px 15px;
            font-size: 14px;
            background-color: #fff !important;
            outline: none;
        }

		/* 针对 Chrome 和其他基于 Webkit 的浏览器 */
		.search-bar input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0 1000px #fff inset !important;
			-webkit-text-fill-color: #000 !important;
			transition: background-color 5000s ease-in-out 0s !important;
		}

		/* Firefox */
		.search-bar input:-moz-autofill {
			box-shadow: 0 0 0px 1000px #fff inset !important;
			-moz-text-fill-color: #000 !important;
		}

        .search-bar button {
            border: none;
            background-color: #43b883;
            color: white;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

		#clear-search-button {
			display: none; 
			background-color: #fff !important;
			color: #555;
		}

        
        /* 分类按钮容器样式 */
        .category-buttons-container {
            display: flex;
            justify-content: center; 
            flex-wrap: wrap;
            gap: 6px;
            padding: 5px;
            width: 100%;
            white-space: nowrap; 
            background-color: transparent; 
            border-radius: 8px;
            box-shadow: none; 
            transition: all 0.3s ease;
        }

        body.dark-theme .category-buttons-container {
            background-color: transparent; /* 暗色模式下的背景透明 */
            box-shadow: none;
        }

        .floating-button-group {
            position: fixed;
            bottom: 40px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px; 
            z-index: 900;
        }
        
        .floating-button-group button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #43b883;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }
        
        .floating-button-group button:hover {
            transform: translateY(-2px);
            background-color: #369f6b;
        }

        #back-to-top-btn {
            display: none; 
        }
        
        body.dark-theme .floating-button-group button {
            background-color: #5d7fb9;
        }
         
        
        /* 分类和卡片样式 */
        .section {
            margin-bottom: 20px;
        }
        
        .section-title-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
        }

        body.dark-theme .section-title-container {
            border-bottom-color: #2a2e38;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            padding: 5px 0; 
            display: flex;
            align-items: center; 
            gap: 8px; 
        }
        
        .section-title:before {
            content: '';
            display: inline-block;
            width: 5px;
            height: 1em;             
            background-color: #43b883;
            border-radius: 2px;
        }

        body.dark-theme .section-title {
            color: #e3e3e3;
        }

        body.dark-theme .section-title:before {
            background-color: #5d7fb9;
        }
        
        .edit-category-btn {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 5px 10px;
            margin-left: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        
        body.dark-theme .edit-category-btn {
            background-color: #388E3C;
            color: #e3e3e3;
        }

        .delete-category-btn {
            background-color: #F44336;
            color: white;
            border: none;
            padding: 5px 10px;
            margin-left: 10px;
            border-radius: 5px;
            cursor: pointer;
        }

        .move-category-btn {
            background-color: #2196f3;
            color: white;
            border: none;
            padding: 2px 1px;
            margin-left: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        .move-category-btn svg {
            width: 24px;
            height: 24px;
            vertical-align: middle;
        }
        
        body.dark-theme .move-category-btn {
            background-color: #1976D2;
            color: #e3e3e3;
        }

        body.dark-theme .delete-category-btn {
            background-color: #D32F2F;
            color: #e3e3e3;
        }
        
        .card-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            padding: 10px;
        }

        .card {
            background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
            border-radius: 8px;
            padding: 10px;
            flex: 1 1 200px; /* 可以伸缩，基础宽度200px */
            min-width: 0; /* 防止内容溢出 */
            box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            border-left: 5px solid #43b883;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            user-select: none;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .card-top {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .card-divider {
            height: 1px;
            background: #c3c3c3;
            margin: 6px 0;
        }
        
        .card-bottom {
            min-height: 28px;
            line-height: 28px;
            overflow: hidden;
        }

        body.dark-theme .card {
            background-image: linear-gradient(to right, #1e2128 0%, #1e2128 100%);
            border-left-color: #5d7fb9;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .card-icon {
            width: 36px;
            height: 36px;
            background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
            border-radius: 30%;
            object-fit: contain;
        }
        
        .card-title {
            font-size: 16px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width:100%
        }
        
        .card-tip {
            font-size: 12px;
            color: #666;
            display: -webkit-box;          /* 关键属性：启用多行文本截断 */
            -webkit-line-clamp: 2;         /* 最多显示两行 */
            -webkit-box-orient: vertical;  /* 垂直方向排列 */
            overflow: hidden;             /* 超出部分隐藏 */
            text-overflow: ellipsis;      /* 超出部分显示省略号 */
            line-height: 14px;             
            max-height: 28px;            
        }

        body.dark-theme .card-title {
            color: #e3e3e3;
        }

        body.dark-theme .card-tip {
            color: #a0a0a0;
        }

        body.dark-theme .card-icon {
            background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898;
            background-blend-mode: multiply,multiply;
        }

        #custom-tooltip {
            position: absolute;
            display: none;
            z-index: 700;
            background: rgba(0, 0, 0, 0.75);
            color: #fff;
            padding: 6px 10px;
            border-radius: 5px;
            font-size: 12px;
            pointer-events: none;
            max-width: 300px;
            white-space: pre-wrap;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: opacity 0.2s ease;
        }
        
        body.dark-theme #custom-tooltip {
            background: rgba(151, 151, 151, 0.75);
            color: #eee;
        }

        .private-tag {
            background-color: #ff9800;
            color: white;
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 3px;
            position: absolute;
            top: 18px;
            right: 5px;
        }

        /* 按钮容器 */
        .card-actions {
            position: absolute;
            top: -10px;
            right: -10px;
            display: flex;
            gap: 3px; 
            z-index: 10;
        }

        /* 按钮通用样式 */
        .card-btn {
            position: relative;
            z-index: 1;
            width: 22px;
            height: 22px;
            border: none;
            border-radius: 50%;
            background: #4caf50; /* 默认绿色 */
            color: white;
            font-size: 12px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, opacity 0.2s;
            padding: 0;
        }
        .card-btn:hover {
            z-index:2;
            transform: translateY(-2px);
        }

        .delete-card-btn {
            background: red;
        }     
        
        /* 版权信息样式 */
        .copyrightparent {
            display: flex;
            justify-content: center; 
        }
        #copyright {
            position: fixed; 
            bottom: 0; 
            width: 100%;
            max-width: 300px; 
            height: 30px;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }
        
        #copyright p {
            margin: 0;
        }
        
        #copyright a {
            color: #007bff;
            text-decoration: none;
        }
        
        #copyright a:hover {
            text-decoration: underline;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .fixed-elements {
                position: static;
                z-index: auto; 
            }

            .admin-btn svg {
                width: 28px; 
                height: 28px;
            }

            #menu-toggle,
            .admin-a {
                display: none;
            }

            .content {
                margin-top: 0;
                padding: 20px;
            }
            
            .setting-panel,
            .floating-button-group {
                right: 10px;
            }
            
        }

        @media (max-width: 480px) {
            .card-container {
                gap: 10px;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            }

            .card {
                padding: 5px;
            }

            .card-title {
                font-size: 14px
            }
            
            .card-icon {
                width: 32px;
                height: 32px;
            }
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 22px;
            text-decoration: none;
        }

        .icon-wrapper {
            display: inline-block;
            width: 48px;       /* 与 SVG 宽度一致 */
            height: 48px;      /* 与 SVG 高度一致 */
            color: #43b883;
            transform-origin: center; /* 旋转中心设为容器中心 */
            animation: spin 2s linear infinite;
        }

        body.dark-theme .icon-wrapper {
            color: #5d7fb9;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* 对话框样式*/
        .dialog-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .dialog-box {
            background-color: #ffffff;
            padding: 24px;
            border-radius: 12px;
            width: 340px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            transform: translateY(-20px);
            animation: slideUp 0.3s ease forwards;
        }
        .dialog-title {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #333;
        }
        .dialog-content {
            padding: 15px 0;
            margin-bottom: 16px;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
        }
        .dialog-box label {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            color: #555;
            font-weight: 500;
        }
        .dialog-box input[type="text"], 
        .dialog-box input[type="password"], 
        .dialog-box select {
            width: 100%;
            margin-bottom: 16px;
            padding: 10px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
            box-sizing: border-box;
            background-color: #ffffff !important;
        }
        .dialog-box input[type="text"]:focus, 
        .dialog-box input[type="password"]:focus, 
        .dialog-box select:focus {
            border-color: #4a90e2 !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        }

        .dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .dialog-box button {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .dialog-confirm-btn {
            background-color: #43b883;
            color: white;
        }
        .dialog-confirm-btn:hover {
            background-color: #3aa876;
        }
        .dialog-cancel-btn {
            background-color: #f0f0f0;
            color: #555;
        }

        .dialog-cancel-btn:hover {
            background-color: #e0e0e0;
        }
        
        .private-link-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        .private-link-container label {
            margin-bottom: 6px;
            color: #555;
        }
        .private-link-container input[type="checkbox"] {
            width: auto;
            margin-bottom: 6px;
            accent-color: #4a90e2;
        }
        .top-z-index {
            z-index: 9999;
        }

        /* 动画效果 */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { 
                transform: translateY(20px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* 黑暗模式样式 */
        body.dark-theme .dialog-box {
            background-color: #2d3748;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .dialog-title {
            color: #f8f9fa;
        }

        body.dark-theme .dialog-content {
            color: #f8f9fa;
        }
        body.dark-theme .dialog-box label,
        body.dark-theme .private-link-container label {
            color: #a0b7d4;
        }

        body.dark-theme .dialog-box input[type="text"],
        body.dark-theme .dialog-box input[type="password"],
        body.dark-theme .dialog-box select {
            background-color: #3c4658 !important;
            color: #e3e3e3 !important;
            border-color: #4a5568 !important;
        }

        body.dark-theme .dialog-box input[type="text"]:focus,
        body.dark-theme .dialog-box input[type="password"]:focus,
        body.dark-theme .dialog-box select:focus {
            border-color: #5a9cec !important;
            box-shadow: 0 0 0 3px rgba(90, 156, 236, 0.3);
        }
        body.dark-theme .dialog-cancel-btn {
            background-color: #4a5568;
            color: #e3e3e3;
        }

        body.dark-theme .dialog-cancel-btn:hover {
            background-color: #3c4658;
        }

        body.dark-theme .dialog-confirm-btn {
            background-color: #5d7fb9;
            color: white;
        }

        body.dark-theme .dialog-confirm-btn:hover {
            background-color: #5473a9;
        }

        /* 遮罩样式 */
        #loading-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6); /* 半透明黑色遮罩 */
            backdrop-filter: blur(4px);
            z-index: 7000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .loading-content {
            background-color: #fff;
            padding: 20px 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 10px #0003;
            font-size: 16px;
            color: #333;
          }
          
          /* 简单 loading 动画 */
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #ccc;
            border-top-color: #3498db;
            border-radius: 50%;
            margin: 0 auto 10px;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

        @media (hover: hover) and (pointer: fine) {
			.admin-btn:hover,
			.admin-a:hover {
				transform: translateY(-2px); 
			}

            .admin-btn.no-hover:hover,
			.admin-a.no-hover:hover {
				transform: none !important; 
			}
            
            .category-button:hover {
                background-color: #43b883;
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
            }
            body.dark-theme .category-button:hover {
                background-color: #5d7fb9;
                color: white;
            }
            
            .card:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
            }
        
            .card.no-hover:hover {
                transform: none !important;
                box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2) !important
            }
        
            body.dark-theme .card.no-hover:hover {
                transform: none !important;
                box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2) !important;
            }

            /* 公共提示框样式 */
            .has-tooltip {
                position: relative;
            }

            .has-tooltip::after {
                content: attr(data-tooltip);
                position: absolute;
                background: rgba(0, 0, 0, 0.75);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
				display: flex;
				align-items: center;
				white-space: nowrap;
				height: auto; 
				pointer-events: none;
            }

            .has-tooltip::before {
                content: "";
                position: absolute;
                border: 6px solid transparent;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .has-tooltip:hover::after,
            .has-tooltip:hover::before {
                opacity: 1;
            }

            /* 暗黑模式 */
            body.dark-theme .has-tooltip:hover::after {
                background: rgba(151, 151, 151, 1);
                color: #eee;
            }
            body.dark-theme .has-tooltip:hover::before {
                border-color: transparent;
            }

            /* 不同方向的样式 */

            /* 上方提示框和箭头 */
            .tooltip-top::after {
                white-space: nowrap;
                bottom: 100%;
                left: 50%;
                margin-bottom: 12px;
                transform: translateX(-50%);
            }
            .tooltip-top::before {
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-top-color: #333;
            }
            body.dark-theme .tooltip-top:hover::before {
                border-top-color: rgba(151, 151, 151, 1);
            }

            /* 下方提示框和箭头 - 可左右偏移 */
            .tooltip-bottom::after {
                top: 100%;
                left: 50%;
                margin-top: 12px;
                transform: translateX(-50%);
            }
            .tooltip-bottom::before {
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-bottom-color: rgba(0, 0, 0, 0.75);
            }

            /* 下方提示框带偏移 */
            .tooltip-bottom-offset::after {
                transform: translateX(calc(-50% + var(--tooltip-offset, 0px)));
            }

            .tooltip-bottom-left {
                --tooltip-offset: -60px;
            }

            body.dark-theme .tooltip-bottom:hover::before {
                border-top-color: rgba(151, 151, 151, 1);
            }

            /* 左侧提示框和箭头 */
            .tooltip-left::after {
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-right: 12px;
                white-space: nowrap;
            }
            .tooltip-left::before {
                top: 50%;
                right: 100%;
                transform: translateY(-50%);
                border-left-color: rgba(0, 0, 0, 0.75);
            }
            body.dark-theme .tooltip-left:hover::before {
                border-left-color: rgba(151, 151, 151, 1);
            }

            /* 右侧提示框和箭头 */
            .tooltip-right::after {
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 12px;
                white-space: nowrap;
            }
            .tooltip-right::before {
                top: 50%;
                left: 100%;
                transform: translateY(-50%);
                border-right-color: rgba(0, 0, 0, 0.75);
            }
            body.dark-theme .tooltip-right:hover::before {
                border-right-color: rgba(151, 151, 151, 1);
            }
        }

        .admin-dropdown-wrapper {
            position: relative; /* 用于下拉菜单定位参考 */
        }

        .admin-dropdown {
            position: absolute;
            top: 100%; 
            right: 0;
            margin-top: 5px;
            background-color: white;
            border: 1px solid #ccc;
            padding: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 100;
            min-width: 120px;
            border-radius: 5px;
        }

        .admin-dropdown.hidden {
            display: none;
        }

        .admin-dropdown button {
            display: block;
            width: 100%;
            margin: 0.3em 0;
            text-align: left;
        }

        .preference-toggle {
            font-size: 13px; 
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 4px;
            margin: 6px 0;
        }

        .preference-toggle span {
            color: #555;
        }

        .preference-toggle input{ 
            cursor: pointer;
        }

        body.dark-theme .admin-dropdown {
            background-color: #2d3748;
            border-color: #4a5568;
        }

        body.dark-theme .preference-toggle span {
            color: #fff;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 20px;
            margin-top: 2px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #dddddd;
            transition: .4s;
            border-radius: 34px;
        }

        .slider.mask {
            background-color: #43b883;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 2px;
            background-color: #ffffff;
            transition: transform 0.4s;
            border-radius: 50%;

            
        }

        .slider.mask:before {
            /* 默认显示太阳图标 */
            mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%23000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>') center / contain no-repeat;
            -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%23000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>') center / contain no-repeat;
        }

        input:checked + .slider {
            background-color: #43b883;
        }

        input:checked + .slider.mask {
            background-color: #5d7fb9;
        }

        body.dark-theme input:checked + .slider {
            background-color: #5d7fb9;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }

        input:checked + .slider.mask:before {
            /* 切换时显示月亮图标 */
            mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%23000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>') center / contain no-repeat;
            -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%23000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>') center / contain no-repeat;
        }

    </style>
    <script>
        (function () {
            let isDark;
            const savePreferences = localStorage.getItem('savePreferences'); // 读取用户保存的偏好设置
            if (savePreferences === 'true') {
                const savedTheme = localStorage.getItem('theme'); // 读取用户保存的主题
                if (savedTheme === 'dark') {
                    isDark = true;
                } else if (savedTheme === 'light') {
                    isDark = false;
                } else {
                    // 没有设置，自动判断时间
                    const hour = new Date().getHours();
                    isDark = (hour >= 21 || hour < 6);
                }
            }
            window.isDarkTheme = isDark;
            // 避免闪白：动态写入 <body class="dark-theme">
            document.write('<body' + (isDark ? ' class="dark-theme"' : '') + '>');
        })();
    </script>
</head>

<body>
    <div class="fixed-elements">
        <div class="top-header-row">
            <a class="logo">
                <div class="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                        <path fill="currentColor" stroke="#fff" stroke-width="2" stroke-linejoin="round" d="M24 24C29.5 24 34 19.5 34 14S29.5 4 24 4zm0 0C24 29.5 28.5 34 34 34s10-4.5 10-10zm0 0C24 18.5 19.5 14 14 14S4 18.5 4 24zm0 0C18.5 24 14 28.5 14 34s4.5 10 10 10z"/>
                    </svg>
                </div>
                我的导航
            </a>
            <!-- 管理员控制面板 -->
            <div class="admin-controls">
                <!-- 下拉包裹器（用于相对定位） -->
                <div class="admin-dropdown-wrapper">
                    <!-- 主按钮 -->
                    <button id="admin-menu-toggle" class="admin-btn no-hover padding">
                        <span>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor"/><rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor"/><rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor"/></svg>
                        </span>
                        <span id="menu-toggle">管理菜单</span>
                    </button>

                    <!-- 下拉菜单 -->
                    <div id="admin-dropdown" class="admin-dropdown hidden">
                        <button id="secret-garden-btn" onclick="toggleSecretGarden()" class="admin-btn">登 录</button>
                        <button id="admin-mode-btn" onclick="toggleAdminMode()" class="admin-btn" data-state="setting">设 置</button>
                        <div class="preference-toggle">
                            <span>主题切换</span>
                            <label class="switch">
                                <input type="checkbox" id="theme-switch-checkbox">
                                <span class="slider mask"></span>
                            </label>
                        </div>
                        <div class="preference-toggle has-tooltip tooltip-left" data-tooltip="搜索引擎及主题">
                            <span>保存偏好</span>
                            <label class="switch">
                                <input type="checkbox" id="save-preference-checkbox">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <a target="_blank" class="admin-a has-tooltip tooltip-bottom tooltip-bottom-offset tooltip-bottom-left" id="original-author" data-tooltip="原作者Github,喜欢请给他点⭐" href="https://github.com/hmhm2022/Card-Tab"><svg stroke-width="0" viewBox="0 0 16 16" class="text-xl svg-icon" height="3em" width="3em" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
            </div>
        </div>
        <div class="search-content">
            <!-- 搜索栏 -->
            <div class="search-container">
                <div class="search-bar">
                    <select id="search-engine-select">
						<option value="site">本站</option>
                        <option value="baidu">百度</option>
                        <option value="bing">必应</option>
                        <option value="google">谷歌</option>
                    </select>
                    <input type="text" id="search-input" placeholder="">
					<button id="clear-search-button" class="has-tooltip tooltip-left" data-tooltip="清除搜索结果">❌</button>
                    <button id="search-button">🔍</button>
					
                </div>
            </div>
        </div>
		<div id="category-buttons-container" class="category-buttons-container"></div>
        
    </div>
    <div class="content">
        <!-- 添加/删除控制按钮 -->
        <div class="setting-panel">
            <button class="round-btn add-card-btn has-tooltip tooltip-left" onclick="showAddDialog()" data-tooltip="添加链接">
                <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 6H8a2 2 0 0 0-2 2v8M16 42H8a2 2 0 0 1-2-2v-8M32 42h8a2 2 0 0 0 2-2v-8M32 6h8a2 2 0 0 1 2 2v8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M32 24H16M24 16v16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
            </button>
            
            <button class="round-btn edit-card-mode-btn has-tooltip tooltip-left" onclick="toggleEditMode()" data-tooltip="编辑链接">
                <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42 26v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M14 26.72V34h7.32L42 13.31 34.7 6 14 26.72Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
                </svg>
            </button>
            
            <button class="round-btn add-category-btn has-tooltip tooltip-left" onclick="addCategory()" data-tooltip="添加分类">
                <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8c0-1.1.9-2 2-2h12l5 6h17c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
                    <path d="M18 27h12M24 21v12" stroke="white" stroke-width="4" stroke-linecap="round"/>
                </svg>
            </button>
            
            <button class="round-btn edit-category-mode-btn has-tooltip tooltip-left" onclick="toggleEditCategory()" data-tooltip="编辑分类">
                <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8c0-1.1.9-2 2-2h12l5 6h17c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
                    <circle cx="24" cy="28" r="4" stroke="white" stroke-width="4" fill="none"/>
                    <path d="M24 21v3m0 8v3m4.8-12-2.1 2.1M20.8 31l-2.1 2.1M19 23l2.1 2.1M27 31l2.1 2.1M17 28h3M28 28h3" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

			<button class="round-btn export-data-btn has-tooltip tooltip-left" onclick="exportData()" data-tooltip="导出数据">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
			</button>
        </div>

        <!-- 分类和卡片容器 -->
        <div id="sections-container"></div>
        <div class="floating-button-group">
            <button id="back-to-top-btn" onclick="scrollToTop()">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24l12-12 12 12m-24 12 12-12 12 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button id="theme-toggle" onclick="toggleTheme()">
            <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star-icon lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
            </button>
        </div>
        
        <!-- 添加链接对话框 -->
        <div class="dialog-overlay" id="dialog-overlay">
            <div class="dialog-box" id="dialog-box">
                <label for="name-input">名称</label>
                <input type="text" id="name-input" placeholder="必填">
                <label for="url-input">地址</label>
                <input type="text" id="url-input" placeholder="必填">
                <label for="tips-input">描述</label>
                <input type="text" id="tips-input" placeholder="可选">
                <label for="tips-input">图标</label>
                <input type="text" id="icon-input" placeholder="可选">
                <label for="category-select">选择分类</label>
                <select id="category-select"></select>
                <div class="private-link-container">
                    <label for="private-checkbox">私密链接</label>    
                    <input type="checkbox" id="private-checkbox">
                </div>
                <div class="dialog-buttons">
                    <button class="dialog-cancel-btn" id="dialog-cancel-btn">取消</button>
                    <button class="dialog-confirm-btn" id="dialog-confirm-btn">确定</button>
                </div>
                
            </div>
        </div>

        <!-- 密码输入框 -->
        <div class="dialog-overlay" id="password-dialog-overlay">
            <div class="dialog-box" id="password-dialog-box">
                <h3>请输入密码</h3>
                <form>
                    <input type="text" id="username-input" autocomplete="username" style="display: none;" aria-hidden="true">
                    <input type="password" id="password-input" autocomplete="current-password" placeholder="输入密码...">
                </form>
                <div class="dialog-buttons">
                    <button class="dialog-cancel-btn" id="password-cancel-btn">取消</button>
                    <button class="dialog-confirm-btn" id="password-confirm-btn">确定</button>
                </div>
            </div>
        </div>

        <!-- 自定义alert -->
        <div class="dialog-overlay top-z-index" id="custom-alert-overlay">
            <div class="dialog-box" id="custom-alert-box">
                <h3 class="dialog-title" id="custom-alert-title">提示</h3>
                <div class="dialog-content" id="custom-alert-content">这里是提示内容</div>
                <div class="dialog-buttons">
                    <button class="dialog-confirm-btn" id="custom-alert-confirm">确定</button>
                </div>
                </div>
            </div>
        </div>

        <!-- 分类名称输入弹窗 -->
        <div class="dialog-overlay" id="category-dialog">
            <div class="dialog-box">
                <h3 id="category-dialog-title" class="dialog-title">新建分类</h3>
                <input 
                    type="text" 
                    id="category-name-input" 
                    class="category-dialog-input"
                    placeholder="请输入分类名称"
                >
                <div class="dialog-buttons">
                    <button id="category-cancel-btn" class="dialog-cancel-btn">取消</button> 
                    <button id="category-confirm-btn" class="dialog-confirm-btn">确定</button>
                </div>
            </div>
        </div>

        <!-- 自定义Confirm弹窗 -->
        <div class="dialog-overlay top-z-index" id="custom-confirm-overlay" class="custom-confirm-overlay">
            <div class="dialog-box">
                <div class="dialog-content" id="custom-confirm-message"></div>
                <div class="dialog-buttons">
                    <button id="custom-confirm-cancel" class="dialog-cancel-btn">取消</button>
                    <button id="custom-confirm-ok" class="dialog-confirm-btn">确定</button>
                </div>
            </div>
        </div>

        <!-- 遮罩 -->
        <div id="loading-mask" style="display:none;">
            <div class="loading-content">
                <div class="spinner"></div>
                <p>加载中，请稍候...</p>
            </div>
        </div>
        <!-- 版权信息 -->
        <!--
        <div class="copyrightparent">
            <div id="copyright" class="copyright">
                <p>项目地址：<a href="https://github.com/hmhm2022/Card-Tab" target="_blank">GitHub</a> 如果喜欢，烦请点个star！</p>
            </div>
        </div>
        -->
       
    </div>
    <div id="custom-tooltip"></div>

    <script>

    // 全局变量
    let isAdmin = false;
    let isLoggedIn = false;
    let editCardMode = false;
    let isEditCategoryMode = false;
    const categories = {};

    // 日志记录函数
    function logAction(action, details) {
        const timestamp = new Date().toISOString();
        const logEntry = timestamp + ': ' + action + ' - ' + JSON.stringify(details);
        console.log(logEntry); 
    }

    const searchEngines = {
        baidu: "https://www.baidu.com/s?wd=",
        bing: "https://www.bing.com/search?q=",
        google: "https://www.google.com/search?q="
    };

    let currentEngine;
    document.addEventListener('DOMContentLoaded', () => {
        const menuToggleBtn = document.getElementById('admin-menu-toggle');
        const themeSwitchCheckbox = document.getElementById('theme-switch-checkbox');
        const dropdown = document.getElementById('admin-dropdown');
        const savePrefCheckbox = document.getElementById('save-preference-checkbox');
        const searchSelect = document.getElementById('search-engine-select');
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        const clearSearchButton = document.getElementById('clear-search-button');

        themeSwitchCheckbox.checked = window.isDarkTheme;

        themeSwitchCheckbox.addEventListener('change', () => {
            const isDark = themeSwitchCheckbox.checked;
            window.isDarkTheme = isDark;

            if (isDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }

            // 若用户勾选了保存偏好，则存储
            if (savePrefCheckbox && savePrefCheckbox.checked) {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }

            logAction('切换主题', { isDarkTheme: window.isDarkTheme });
        });

        // 读取保存偏好设置
        const savedPref = localStorage.getItem('savePreferences') === 'true';
        savePrefCheckbox.checked = savedPref;

        // 初始化搜索引擎
        currentEngine = (savedPref && localStorage.getItem('searchEngine')) || 'site';
        setActiveEngine(currentEngine);

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        // const isTouchDevice = true;

        if (isTouchDevice) {
            // 移动端：点击切换
            menuToggleBtn.addEventListener('click', () => {
                dropdown.classList.toggle('hidden');
            });

            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (!menuToggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });
        } else {
            // 桌面端：鼠标移入显示，移出隐藏
            menuToggleBtn.addEventListener('mouseenter', () => {
                dropdown.classList.remove('hidden');
            });

            menuToggleBtn.addEventListener('mouseleave', (e) => {
                // 设置一个延迟，防止直接跳过 dropdown 区域
                setTimeout(() => {
                    if (!dropdown.matches(':hover') && !menuToggleBtn.matches(':hover')) {
                        dropdown.classList.add('hidden');
                    }
                }, 200);
            });

            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.add('hidden');
            });

            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.remove('hidden');
            });
        }

        // 保存偏好切换
        savePrefCheckbox.addEventListener('change', () => {
            const enabled = savePrefCheckbox.checked;
            localStorage.setItem('savePreferences', enabled);

            if (!enabled) {
                // 不保存时清理相关本地存储
                localStorage.removeItem('searchEngine');
                localStorage.removeItem('theme');
            } else {
                // 启用保存时立即保存当前值
                localStorage.setItem('searchEngine', currentEngine);
                localStorage.setItem('theme', window.isDarkTheme ? 'dark' : 'light');

                if (window.isDarkTheme) {
                    applyDarkTheme();
                } else {
                    document.body.classList.remove('dark-theme');
                }

                // 保证select显示正确搜索引擎
                setActiveEngine(currentEngine);
            }

            logAction('切换保存偏好', { enabled });
        });

        // 监听搜索引擎下拉选择变化
        if (searchSelect) {
            searchSelect.value = currentEngine;
            searchSelect.addEventListener('change', function () {
                setActiveEngine(this.value);
            });
        }

        // 搜索按钮点击事件
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    if (currentEngine === 'site') {
                        logAction('执行本站搜索', { query });
                        searchLinks(query); 
                    } else {
                        logAction('跳转外部搜索', { engine: currentEngine, query });
                        window.open(searchEngines[currentEngine] + encodeURIComponent(query), '_blank');
                    }
                }
            });
        }

        // 清空搜索按钮
        if (clearSearchButton) {
            clearSearchButton.addEventListener('click', () => {
                searchInput.value = '';
                loadSections(); 
            });
        }

        // 搜索输入框回车事件
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (searchButton) searchButton.click();
                }
            });
        }
    });

    function updateThemeSwitchUI() {
        const themeSwitchCheckbox = document.getElementById('theme-switch-checkbox');
        if (themeSwitchCheckbox) {
            themeSwitchCheckbox.checked = window.isDarkTheme;
        }
    }

    /**
     * 设置当前搜索引擎
     * @param {string} engine 
     */
    function setActiveEngine(engine) {
        if (!searchEngines.hasOwnProperty(engine) && engine !== 'site') {
            engine = 'site'; 
        }
        currentEngine = engine;

        const savePrefCheckbox = document.getElementById('save-preference-checkbox');
        if (savePrefCheckbox && savePrefCheckbox.checked) {
            localStorage.setItem('searchEngine', engine);
        }

        const select = document.getElementById('search-engine-select');
        if (select) select.value = engine;

        logAction('设置搜索引擎', { engine });
    }

	function setSearchDisabledState(disabled) {
		const controls = document.querySelectorAll(
			'#search-input, #search-button, #clear-search-button'
		);

		controls.forEach(control => {
			if (disabled) {
				control.style.opacity = '0.6';
				control.style.cursor = 'not-allowed';
				control.disabled = true;
			} else {
				control.style.opacity = '';
				control.style.cursor = '';
				control.disabled = false;
			}
		});
	}
    
    // 添加新分类
    async function addCategory() {
		if (!await validateToken()) {
            return; 
        }
        const categoryName = await showCategoryDialog('请输入新分类名称');
        if (categoryName && !categories[categoryName]) {
            categories[categoryName] = [];
            updateCategorySelect();
            renderCategories();
            saveLinks().catch(err => {
                customAlert('保存失败：' + err.message);
            });
            logAction('添加分类', { categoryName, currentLinkCount: getAllLinks().length });
        } else if (categories[categoryName]) {
            customAlert('该分类已存在');
            logAction('添加分类失败', { categoryName, reason: '分类已存在' });
        }
    }

    // 编辑分类名称
    async function editCategoryName(oldName) {
        if (!await validateToken()) return;
    
        const newName = await showCategoryDialog('请输入新的分类名称', oldName);
        if (!newName || newName === oldName) return;
    
        if (categories[newName]) {
            customAlert('该名称已存在，请重新命名')
            return;
        }
    
        categories[newName] = categories[oldName];
        categories[newName].forEach(item => {
            item.category = newName; 
        });
        delete categories[oldName];
    
        renderCategories();
        renderCategoryButtons();
        updateCategorySelect();
        saveLinks().catch(err => {
            customAlert('删除失败：' + err.message);
        });
    
        logAction('编辑分类名称', { oldName, newName });
    }
    

    // 删除分类
    async function deleteCategory(category) {
		if (!await validateToken()) {
            return; 
        }

        const message = '确定要删除 "' + category + '" 分类吗？这将删除该分类下的所有链接。';
        const confirmed = await customConfirm(message);
        
        if (confirmed) {
            delete categories[category];
            updateCategorySelect();
            renderCategories();
            renderCategoryButtons();
            saveLinks().catch(err => {
                customAlert('删除失败：' + err.message);
            });
            logAction('删除分类', { category });
        }
    } 
    
    // 移动分类
    async function moveCategory(categoryName, direction) {
        if (!await validateToken()) {
            return; 
        }
        const keys = Object.keys(categories);
        const index = keys.indexOf(categoryName);
        if (index < 0) return;
    
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= keys.length) return;
    
        // 重建一个新顺序的 categories 对象
        const newCategories = {};
        const reordered = [...keys];
        [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
        reordered.forEach(key => {
            newCategories[key] = categories[key];
        });
    
        // 替换原有 categories 并重渲染
        Object.keys(categories).forEach(k => delete categories[k]);
        Object.assign(categories, newCategories);
    
        renderCategories();
        renderCategoryButtons();
        updateCategorySelect();
        saveLinks().catch(err => {
            customAlert('移动失败：' + err.message);
        });
    
        logAction('移动分类', { categoryName, direction });
    }
    
	function getFilteredCategoriesByKeyword(query) {
		const lowerQuery = query.toLowerCase();
		const result = {};

		Object.keys(categories).forEach(category => {
			let privateCount = 0;
			let linkCount = 0;

			const matchedLinks = categories[category].filter(link => {
				const nameMatch = link.name && link.name.toLowerCase().includes(lowerQuery);
				const tipsMatch = link.tips && link.tips.toLowerCase().includes(lowerQuery);
				const matched = nameMatch || tipsMatch;

				if (matched) {
					if (link.isPrivate) privateCount++;
					linkCount++;
				}

				return matched;
			});

			if (matchedLinks.length > 0) {
				result[category] = matchedLinks;
			}
		});

		return result;
	}

    function renderCategorySections({ 
		filterPrivate = false, 
		renderButtons = false, 
		logTag = '渲染分类',
		searchMode = false,
		filteredCategories = null 
	} = {}) {
		const container = document.getElementById('sections-container');
		const fragment = document.createDocumentFragment();

		const sourceCategories = searchMode && filteredCategories 
			? filteredCategories 
			: categories;

		Object.keys(sourceCategories).forEach(category => {
			const section = document.createElement('div');
			section.className = 'section';

			const titleContainer = document.createElement('div');
			titleContainer.className = 'section-title-container';

			const title = document.createElement('div');
			title.className = 'section-title';
			title.textContent = category;
			titleContainer.appendChild(title);

			if (isAdmin) {
				const editBtn = document.createElement('button');
				editBtn.textContent = '编辑名称';
				editBtn.className = 'edit-category-btn';
				editBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
				editBtn.onclick = () => editCategoryName(category);
				titleContainer.appendChild(editBtn);

				const deleteBtn = document.createElement('button');
				deleteBtn.textContent = '删除分类';
				deleteBtn.className = 'delete-category-btn';
				deleteBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
				deleteBtn.onclick = () => deleteCategory(category);
				titleContainer.appendChild(deleteBtn);

				const upBtn = document.createElement('button');
				upBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6l-6 6h4v6h4v-6h4z"/></svg>';
				upBtn.className = 'move-category-btn';
				upBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
				upBtn.onclick = () => moveCategory(category, -1);
				titleContainer.appendChild(upBtn);

				const downBtn = document.createElement('button');
				downBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 18l6-6h-4v-6h-4v6h-4z"/></svg>';
				downBtn.className = 'move-category-btn';
				downBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
				downBtn.onclick = () => moveCategory(category, 1);
				titleContainer.appendChild(downBtn);
			}

			const cardContainer = document.createElement('div');
			cardContainer.className = 'card-container';
			cardContainer.id = category;

			section.appendChild(titleContainer);
			section.appendChild(cardContainer);

			let linksInCategory = sourceCategories[category];
			let privateCount = 0;
			let linkCount = 0;

			linksInCategory.forEach(link => {
				if (link.isPrivate) privateCount++;
				linkCount++;
				createCard(link, cardContainer);
			});

			if (privateCount < linkCount || isLoggedIn) {
				fragment.appendChild(section);
			}
		});

		container.replaceChildren(...fragment.childNodes);

		if (renderButtons) {
			renderCategoryButtons();
		}

		logAction(logTag, {
			isAdmin,
			categoryCount: Object.keys(sourceCategories).length,
			linkCount: Object.values(sourceCategories).flat().length
		});
	}

	// 渲染分类
	function renderCategories() {
		renderCategorySections({
			renderButtons: false,
			logTag: '渲染分类'
		});
	} 

	function searchLinks(query) {
		const clearBtn = document.getElementById('clear-search-button');
		const filteredData = getFilteredCategoriesByKeyword(query);

		if (Object.keys(filteredData).length === 0) {
			customAlert('没有找到相关站点。');
			return;
		}
		clearBtn.style.display = 'block';
		renderCategorySections({
			renderButtons: true,
			logTag: '搜索结果',
			searchMode: true,
			filteredCategories: filteredData
		});
	}
    
    // 渲染分类快捷按钮
    function renderCategoryButtons() {
		const buttonsContainer = document.getElementById('category-buttons-container');
		const fragment = document.createDocumentFragment();

		const sectionTitles = document.querySelectorAll('#sections-container .section-title');
		const displayedCategories = Array.from(sectionTitles).map(title => title.textContent);

		const visibleCategories = displayedCategories.filter(category =>
			categories[category].some(link => !link.isPrivate || isLoggedIn)
		);

		if (visibleCategories.length === 0) {
			buttonsContainer.style.display = 'none';
			return;
		}

		visibleCategories.forEach(category => {
			const button = document.createElement('button');
			button.className = 'category-button';
			button.textContent = category;
			button.dataset.category = category;

			button.addEventListener('click', () => {
				scrollToCategory(category);
			});

			fragment.appendChild(button);
		});

		buttonsContainer.replaceChildren(...fragment.childNodes);
		buttonsContainer.style.display = 'flex';

		// 延迟设置活跃按钮
		setTimeout(setActiveCategoryButtonByVisibility, 100);
	}
    

    // 根据可见性设置活跃的分类按钮
    function setActiveCategoryButtonByVisibility() {
        const sections = document.querySelectorAll('.section');
        if (!sections.length) return;
        const buttons = document.querySelectorAll('.category-button');
        buttons.forEach(btn => btn.classList.remove('active'));

        // 获取 fixed 元素高度
        const fixedElements = document.querySelector('.fixed-elements');
        const fixedHeight = fixedElements?.getBoundingClientRect()?.height || 0;

        // 动态设置中心点，并限制不能超过视窗高度
        const scrollTop = window.scrollY || window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollRatio = Math.min(scrollTop / maxScroll, 1);
        const dynamicOffset = scrollRatio * 150;
        let viewportCenter = 95 + fixedHeight  + scrollRatio * (window.innerHeight / 2) + dynamicOffset;

        viewportCenter = Math.min(viewportCenter, window.innerHeight); // 限制最大值

        let closestSection = null;
        let minDistance = Infinity;

        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;

            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section;
            }
        }

        if (closestSection) {
            const categoryId = closestSection.querySelector('.card-container')?.id;
            if (!categoryId) return;

            // 设置当前匹配的按钮为活跃状态
            buttons.forEach(btn => {
                if (btn.dataset.category === categoryId) {
                    btn.classList.add('active');
                }
            });
        }
    }

    // 添加滚动事件监听器，滚动时更新活跃的分类按钮
    window.addEventListener('scroll', debounce(setActiveCategoryButtonByVisibility, 100))

    // 防抖函数，避免过多的滚动事件处理
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    function scrollToCategory(category) {
        const fixedElements = document.querySelector('.fixed-elements');
        const section = document.getElementById(category);
        if (section) {
            const fixedHeight = fixedElements?.getBoundingClientRect()?.height || 0;

            //  获取 section 的 top 和 height
            const sectionRect = section.getBoundingClientRect();
            const sectionHeight = sectionRect.height;
            const sectionOffsetTop = section.offsetTop;

            const sectionCenterAbs = sectionOffsetTop;

            const pageHeight = document.body.scrollHeight;
            const maxScroll = pageHeight - window.innerHeight;

            //  用 section 中心点来反推目标 scrollRatio
            const scrollRatio = Math.min(sectionCenterAbs / pageHeight, 1);

            //  用 scrollRatio 来计算目标 viewportCenter（保持和 setActiveCategoryButtonByVisibility 一致）
            const dynamicOffset = scrollRatio* 150;
            let viewportCenter = fixedHeight + scrollRatio * (window.innerHeight / 2) + dynamicOffset;
            viewportCenter = Math.min(viewportCenter, window.innerHeight);

            const targetScrollTop = sectionCenterAbs - viewportCenter;

            window.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
    
            logAction('滚动到分类', { category });
        }
    }

	function getAllLinks() {
		return Object.values(categories).flat(); 
	}

	function getPublicLinks() {
		return Object.values(categories)
			.flat()
			.filter(item => !item.isPrivate);
	}
    
    // 读取链接数据
    async function loadLinks() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // 如果已登录，从 localStorage 获取 token 并添加到请求头
        if (isLoggedIn) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = token; 
            }
        }
        
        try {
            const response = await fetch('/api/getLinks?userId=testUser', {
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }
            
            
            const data = await response.json();
            
            if (data.categories) {
                Object.assign(categories, data.categories);
            }

            loadSections();
            updateCategorySelect();
            updateUIState();
            logAction('读取链接', { 
                isLoggedIn: isLoggedIn,
                hasToken: !!localStorage.getItem('authToken')
            });
        } catch (error) {
            console.error('Error loading links:', error);
            alert('加载链接时出错，请刷新页面重试');
        }
    }

    async function updateLink(oldLink) {
        if (!await validateToken()) return;
    
        const name = document.getElementById('name-input').value;
        const url = document.getElementById('url-input').value;
        const tips = document.getElementById('tips-input').value;
        const icon = document.getElementById('icon-input').value.trim();
        const category = document.getElementById('category-select').value;
        const isPrivate = document.getElementById('private-checkbox').checked;
    
        const updatedLink = { name, url, tips, icon, category, isPrivate };
    
        disableDialogControl()

        try {
            for (const [categoryName, linksInCategory] of Object.entries(categories)) {
				const index = linksInCategory.findIndex(l => l.url === oldLink.url);
				if (index !== -1) {
					if (categoryName !== category) {
						linksInCategory.splice(index, 1);
						categories[category].push(updatedLink);
					} else {
						linksInCategory[index] = updatedLink;
					}
					break;
				}
			}
        
            await saveLinks();
            renderCategories(); 
            hideAddDialog();
        } catch (error) {
            logAction('更新卡片失败:', error);
            await customAlert('更新卡片失败:' + error.message);
        } finally {
            // 启用所有控件
            enableDialogControls();
        }
        
    }
    
    
    // 更新UI状态
    function updateUIState() {
        const adminBtn = document.getElementById('admin-mode-btn');
        const secretGardenBtn = document.getElementById('secret-garden-btn');
        const settingPanel = document.querySelector('.setting-panel');
        adminBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
        secretGardenBtn.dataset.state = isLoggedIn ? 'logout' : 'login';
        secretGardenBtn.textContent = isLoggedIn ? "退  出" : "登  录";
        secretGardenBtn.style.display = 'inline-block';
        let searchDisabled = false;
    
        if (isAdmin) {
            adminBtn.textContent = "离开设置";
            adminBtn.style.display = 'inline-block';
            settingPanel.style.display = 'flex';
			searchDisabled = true;
        } else if (isLoggedIn) {
            adminBtn.textContent = "设  置";
            adminBtn.style.display = 'inline-block';
            settingPanel.style.display = 'none';
        } else {
            adminBtn.style.display = 'none';
            settingPanel.style.display = 'none';
        }
        setSearchDisabledState(searchDisabled);
        
        logAction('更新UI状态', { isAdmin, isLoggedIn });
    }
    
    // 登录状态显示（加载所有链接）
    function showSecretGarden() {
        if (isLoggedIn) {
            loadSections();
            // 显示所有私密标签
            document.querySelectorAll('.private-tag').forEach(tag => {
                tag.style.display = 'block';
            });
            logAction('显示私密花园');
        }
    }
    
    // 加载分类和链接
    function loadSections() {
		document.getElementById('clear-search-button').style.display = 'none';
		document.getElementById('search-input').value = '';
		renderCategorySections({
			renderButtons: true,
			logTag: '加载分类和链接'
		});
	}


    function isValidUrl(url) {
        try {
            new URL(url); 
            return true;
        } catch {
            return false;
        }
    }

    const imgApi = 'https://www.faviconextractor.com/favicon/';

    // 从URL中提取域名
    function extractDomain(url) {
        let domain;
        try {
            domain = new URL(url).hostname;
        } catch (e) {
            domain = url;
        }
        return domain;
    }

    // 创建卡片
    function createCard(link, container) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('draggable', isAdmin);
        card.dataset.isPrivate = link.isPrivate;
        card.setAttribute('data-url', link.url);
    
        // 创建顶部容器
        const cardTop = document.createElement('div');
        cardTop.className = 'card-top';
    
        // 定义默认的 SVG 图标
        const defaultIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' +
        '</svg>';
        const icon = document.createElement('img');
        icon.className = 'card-icon';
        icon.src = (
            !link.icon || 
            typeof link.icon !== 'string' || 
            !link.icon.trim() || 
            !isValidUrl(link.icon)
        ) 
            ? imgApi + extractDomain(link.url)
            : link.icon;

        icon.alt = 'Website Icon';

        // 错误处理：如果图片加载失败，使用默认的 SVG 图标
        icon.onerror = function() {
            const svgBlob = new Blob([defaultIconSVG], {type: 'image/svg+xml'});
            const svgUrl = URL.createObjectURL(svgBlob);
            this.src = svgUrl;
            
            // 清理：当图片不再需要时，撤销对象 URL
            this.onload = () => URL.revokeObjectURL(svgUrl);
        };
    
        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = link.name;

        // 将图标和标题添加到顶部容器
        cardTop.appendChild(icon);
        cardTop.appendChild(title);

        // 创建分隔线
        const divider = document.createElement('div');
        divider.className = 'card-divider';

        // 创建底部容器
        const cardBottom = document.createElement('div');
        cardBottom.className = 'card-bottom';
    
        const tips = document.createElement('div');
        tips.className = 'card-tip';
        tips.textContent = link.tips || ''; 
        cardBottom.appendChild(tips);

        // 将各部分添加到卡片
        card.appendChild(cardTop);
        card.appendChild(divider);
        card.appendChild(cardBottom);
        
    
        if (link.isPrivate) {
            const privateTag = document.createElement('div');
            privateTag.className = 'private-tag';
            privateTag.textContent = '私密';
            card.appendChild(privateTag);
        }
    
        const correctedUrl = link.url.startsWith('http://') || link.url.startsWith('https://') ? link.url : 'http://' + link.url;
    
        if (!isAdmin) {
            card.addEventListener('click', () => {
                window.open(correctedUrl, '_blank');
                logAction('打开链接', { name: link.name, url: correctedUrl });
            });
        }
    
        // 创建按钮容器
        const cardActions = document.createElement('div');
        cardActions.className = 'card-actions';

        // 编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'card-btn edit-card-btn has-tooltip tooltip-top';
        editBtn.textContent = '✎';
        editBtn.dataset.tooltip = '编辑';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            showEditDialog(link);
        };

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'card-btn delete-card-btn has-tooltip tooltip-top';
        deleteBtn.textContent = '✖';
        deleteBtn.dataset.tooltip = '删除';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            removeCard(card);
        };

        cardActions.append(editBtn, deleteBtn);
        card.appendChild(cardActions);
    
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragover', dragOver);
        card.addEventListener('dragend', dragEnd);
        card.addEventListener('drop', drop);
        // card.addEventListener('touchstart', touchStart, { passive: false });

        card.addEventListener('mousemove', (e) => handleTooltipMouseMove(e, link.tips, isAdmin));
        card.addEventListener('mouseleave', handleTooltipMouseLeave);
    
        if (isAdmin && editCardMode) {
            deleteBtn.style.display = 'block';
            editBtn.style.display = 'block';
        }
    
        if (isAdmin || (link.isPrivate && isLoggedIn) || !link.isPrivate) {
            container.appendChild(card);
        }
        // logAction('创建卡片', { name: link.name, isPrivate: link.isPrivate });
    }
    
    
    // 更新分类选择下拉框
    function updateCategorySelect() {
		const categorySelect = document.getElementById('category-select');
		const fragment = document.createDocumentFragment();

		Object.keys(categories).forEach(category => {
			const option = document.createElement('option');
			option.value = category;
			option.textContent = category;
			fragment.appendChild(option);
		});

		categorySelect.replaceChildren(...fragment.childNodes);

		logAction('更新分类选择', { categoryCount: Object.keys(categories).length });
	}
    
    // 保存链接数据
    async function saveLinks() {
        if (isAdmin && !(await validateToken())) {
            return;
        }

		const allLinks = getAllLinks();
    
        try {
            await fetch('/api/saveOrder', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authToken')
                },
                body: JSON.stringify({ 
                    userId: 'testUser', 
                    categories: categories
                }),
            });
            logAction('保存链接', { linkCount: allLinks.length, categoryCount: Object.keys(categories).length });
        } catch (error) {
            logAction('保存链接失败', { error: error.message });
            alert('保存链接失败，请重试');
        }
    }

    function disableDialogControl() {
        const dialog = document.getElementById('dialog-box');
        if (dialog) {
            // 禁用所有按钮和输入控件
            const controls = dialog.querySelectorAll('button, input, textarea, select');
            controls.forEach(control => {
                control.disabled = true;
                // 添加视觉提示
                control.style.opacity = '0.6';
                control.style.cursor = 'not-allowed';
            });
            
        }
    }
    
    function enableDialogControls() {
        const dialog = document.getElementById('dialog-box');
        if (dialog) {
            // 启用所有按钮和输入控件
            const controls = dialog.querySelectorAll('button, input, textarea, select');
            controls.forEach(control => {
                control.disabled = false;
                // 恢复视觉样式
                control.style.opacity = '';
                control.style.cursor = '';
            });
            
        }
    }
    
    // 添加卡片弹窗
    async function addLink() {
        if (!await validateToken()) {
            return;
        }

        const name = document.getElementById('name-input').value.trim();
        const url = document.getElementById('url-input').value.trim();
        const tips = document.getElementById('tips-input').value.trim();
        const icon = document.getElementById('icon-input').value.trim();
        const category = document.getElementById('category-select').value;
        const isPrivate = document.getElementById('private-checkbox').checked;
    
        // 验证必填字段
        if (!name || !url || !category) {
            let errorMessage = '';
            if (!name && !url) {
                errorMessage = '请输入名称和URL';
            } else if (!name) {
                errorMessage = '请输入名称';
            } else if (!url) {
                errorMessage = '请输入URL';
            } else if (!category) {
                errorMessage = '请先添加分类';
            }
    
            // 显示错误提示并重新聚焦到第一个缺失的字段
            await customAlert(errorMessage);
            if (!name) {
                document.getElementById('name-input').focus();
            } else if (!url) {
                document.getElementById('url-input').focus();
            }
            return;
        }
    
        const normalizedUrl = url.toLowerCase();
        const allLinks = getAllLinks();
        const isUrlExists = allLinks.some(link => link.url.toLowerCase() === normalizedUrl);
        
        if (isUrlExists) {
            await customAlert('该URL已存在，请勿重复添加');
            document.getElementById('url-input').focus();
            return;
        }
    
        const newLink = { name, url, tips, icon, category, isPrivate };

        disableDialogControl();

        try {
			categories[category].push(newLink);
    
            await saveLinks();
        
            if (isAdmin || (isPrivate && isLoggedIn) || !isPrivate) {
                const container = document.getElementById(category);
                if (container) {
                    createCard(newLink, container);
                } else {
                    categories[category] = [];
                    renderCategories();
                }
            }
        
            hideAddDialog();
            logAction('添加卡片', { name, url, tips, icon, category, isPrivate });
        } catch (error) {
            logAction('添加卡片失败:', error);
            customAlert('添加卡片失败:' + error)
        } finally {
            // 清空表单
            document.getElementById('name-input').value = '';
            document.getElementById('url-input').value = '';
            document.getElementById('tips-input').value = '';
            document.getElementById('private-checkbox').checked = false;
            enableDialogControls();
        }
        
    }

    // 删除卡片
    async function removeCard(card) {
        if (!await validateToken()) {
            return; 
        }
        const name = card.querySelector('.card-title').textContent;
        const url = card.getAttribute('data-url');
        const isPrivate = card.dataset.isPrivate === 'true';
        
        for (const category in categories) {
			const index = categories[category].findIndex(link => link.url === url);
			if (index !== -1) {
				categories[category].splice(index, 1);
				break;
			}
		}

        card.remove(); 
        saveLinks().catch(err => {
            customAlert('删除失败：' + err.message);
        });

        logAction('删除卡片', { name, url, isPrivate });
    }
    
    // 拖拽卡片
    let draggedCard = null;
    let touchStartX, touchStartY;
    
    // 触屏端拖拽卡片
    function touchStart(event) {
        if (!isAdmin) return;
        draggedCard = event.target.closest('.card');
        if (!draggedCard) return;
    
        event.preventDefault();
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    
        draggedCard.classList.add('dragging');
        
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('touchend', touchEnd);
    
    }
    
    function touchMove(event) {
        if (!draggedCard) return;
        event.preventDefault();
    
        const touch = event.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;
        draggedCard.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";
    
        const target = findCardUnderTouch(currentX, currentY);
        if (target && target !== draggedCard) {
            const container = target.parentElement;
            const targetRect = target.getBoundingClientRect();
    
            if (currentX < targetRect.left + targetRect.width / 2) {
                container.insertBefore(draggedCard, target);
            } else {
                container.insertBefore(draggedCard, target.nextSibling);
            }
        }
    }
    
    function touchEnd(event) {
        if (!draggedCard) return;
    
        const card = draggedCard;
        const targetCategory = card.closest('.card-container').id;
    
        validateToken().then(isValid => {
            if (isValid && card) {
                updateCardCategory(card, targetCategory);
                saveCardOrder().catch(error => {
                    console.error('Save failed:', error);
                });
            }
            cleanupDragState();
        });
    }
    
    function findCardUnderTouch(x, y) {
        const cards = document.querySelectorAll('.card:not(.dragging)');
        return Array.from(cards).find(card => {
            const rect = card.getBoundingClientRect();
            return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        });
    }

    // PC端拖拽卡片
    function dragStart(event) {
        if (!isAdmin) {
            event.preventDefault();
            return;
        }
        draggedCard = event.target.closest('.card');
        if (!draggedCard) return;
    
        draggedCard.classList.add('dragging');
        event.dataTransfer.effectAllowed = "move";
        logAction('开始拖拽卡片', { name: draggedCard.querySelector('.card-title').textContent });
    }
    
    function dragOver(event) {
        if (!isAdmin) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        const target = event.target.closest('.card');
        if (target && target !== draggedCard) {
            const container = target.parentElement;
            const mousePositionX = event.clientX;
            const targetRect = target.getBoundingClientRect();
    
            if (mousePositionX < targetRect.left + targetRect.width / 2) {
                container.insertBefore(draggedCard, target);
            } else {
                container.insertBefore(draggedCard, target.nextSibling);
            }
        }
    }
    
	// 清理拖拽状态函数
    function cleanupDragState() {
        if (draggedCard) {
            draggedCard.classList.remove('dragging');
            draggedCard.style.transform = '';
            draggedCard = null;
        }
        
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('touchend', touchEnd);
        
        touchStartX = null;
        touchStartY = null;
    }
    // PC端拖拽结束
    function drop(event) {
        if (!isAdmin) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        
        const card = draggedCard;
        const targetCategory = event.target.closest('.card-container').id;
        
        validateToken().then(isValid => {
            if (isValid && card) {
                updateCardCategory(card, targetCategory);
                saveCardOrder().catch(error => {
                    console.error('Save failed:', error);
                });
            }
            cleanupDragState();
        });
    }
	function dragEnd(event) {
        if (draggedCard) {
            draggedCard.classList.remove('dragging');
            logAction('拖拽卡片结束');
        }
    }
  
    // 更新卡片分类
    function updateCardCategory(card, newCategory) {
        const cardTitle = card.querySelector('.card-title').textContent;
        const cardUrl = card.getAttribute('data-url');
        const isPrivate = card.dataset.isPrivate === 'true';
    
        for (const category in categories) {
			const index = categories[category].findIndex(link => link.url === cardUrl);
			if (index !== -1) {
				// 如果新分类不存在则创建
				if (!categories[newCategory]) {
					categories[newCategory] = [];
				}
				
				// 移动链接
				const [link] = categories[category].splice(index, 1);
				link.category = newCategory;
				categories[newCategory].push(link);
				break;
			}
		}
    
        card.dataset.category = newCategory;
    }

    // 在页面加载完成后添加触摸事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        const cardContainers = document.querySelectorAll('.card-container');
        cardContainers.forEach(container => {
            container.addEventListener('touchstart', touchStart, { passive: false });
        });
    });    
    
    // 保存卡片顺序
    async function saveCardOrder() {
		if (!await validateToken()) {
			return; 
		}
		
		const containers = document.querySelectorAll('.card-container');
		const allLinks = getAllLinks();
		
		// 清空categories并重新填充
		const newCategories = {};
		
		containers.forEach(container => {
			const category = container.id;
			newCategories[category] = [];
			
			[...container.children].forEach(card => {
				if (card.classList.contains('card')) {
					const url = card.getAttribute('data-url');
					const tips = card.querySelector('.card-tip').textContent;
					const name = card.querySelector('.card-title').textContent;
					const iconElement = card.querySelector('.card-icon');
					const src = iconElement ? iconElement.getAttribute('src') : '';
					const icon = src.startsWith(imgApi) ? '' : src;
					const isPrivate = card.dataset.isPrivate === 'true';
					
					// 更新或创建链接对象
					const existingLink = Object.values(categories).flat().find(
						link => link.url === url
					);
					
					newCategories[category].push(existingLink || { 
						name, 
						url, 
						tips, 
						icon, 
						category, 
						isPrivate 
					});
				}
			});
		});
		
		// 替换旧categories
		Object.keys(categories).forEach(key => delete categories[key]);
		Object.assign(categories, newCategories);
		
		logAction('保存卡片顺序', { 
			categoryCount: Object.keys(newCategories).length,
			linkCount: allLinks.length
		});
		
		try {
			const response = await fetch('/api/saveOrder', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('authToken')
				},
				body: JSON.stringify({ 
					userId: 'testUser', 
					categories: newCategories
				}),
			});
			const result = await response.json();
			if (!result.success) {
				throw new Error('Failed to save order');
			}
			logAction('保存卡片顺序成功', { 
				categoryCount: Object.keys(newCategories).length,
				linkCount: allLinks.length
			});
		} catch (error) {
			logAction('保存顺序失败', { error: error.message });
			alert('保存顺序失败，请重试');
		}
	}             
    
    // 设置状态重新加载卡片
    async function reloadCardsAsAdmin() {
		// 加载时加淡出效果
		const container = document.getElementById('sections-container');
		container.style.opacity = '0.3';

		await loadLinks(); 

		// 加载完淡入
		container.style.transition = 'opacity 0.3s';
		container.style.opacity = '1';

		if (window.isDarkTheme) {
			applyDarkTheme();
		}

		logAction('重新加载卡片（管理员模式）');
	}
    
    // 切换设置状态
    async function toggleAdminMode() {
        const adminBtn = document.getElementById('admin-mode-btn');
        const settingPanel = document.querySelector('.setting-panel');
		const searchInput = document.getElementById('search-input');
		const searchButton = document.getElementById('search-button');
		const clearSearchButton = document.getElementById('clear-search-button');
        
        try {
            showLoading(isAdmin ? '正在退出设置模式...' : '正在进入设置模式...');
            
            // 无论是进入还是退出设置模式，都先验证token
            if (!await validateToken()) {
                logAction('Token验证失败');
                return; 
            }
    
            if (!isAdmin && isLoggedIn) {
                // 在进入设置模式之前进行备份
                try {
                    const response = await fetch('/api/backupData', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('authToken')
                        },
                        body: JSON.stringify({ 
                            sourceUserId: 'testUser', 
                            backupUserId: 'backup' 
                        }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        logAction('数据备份成功');
                    } else {
                        throw new Error('备份失败');
                    }
                } catch (error) {
                    logAction('数据备份失败', { error: error.message });
                    const confirmed = await customConfirm(
                        '备份失败，是否仍要继续进入设置模式？', 
                        '是', 
                        '否'
                    );
                    if (!confirmed) {
                        return;
                    }
                }
    
                isAdmin = true;
                adminBtn.textContent = "退出设置";
                settingPanel.style.display = 'flex';
                await reloadCardsAsAdmin();
                logAction('进入设置');
            } else if (isAdmin) {
                isAdmin = false;
                editCardMode = false;
                adminBtn.textContent = "设  置";
                settingPanel.style.display = 'none';
                await reloadCardsAsAdmin();
                logAction('离开设置');
            }
            
            updateUIState();
        } catch (error) {
            logAction('设置模式切换出错', { error: error.message });
        } finally {
            hideLoading();
            document.getElementById('custom-tooltip').style.display = 'none';
        }
    }     
    
    // 切换到登录状态
    function toggleSecretGarden() {
        if (!isLoggedIn) {
            showPasswordDialog();
        } else {
            isLoggedIn = false;
            isAdmin = false;
            localStorage.removeItem('authToken');
            loadLinks();
            updateUIState();
            logAction('退出登录');
        }
    }
    
    function showPasswordDialog() {
        const dialog = document.getElementById('password-dialog-overlay');
        const passwordInput = document.getElementById('password-input');
        const cancelBtn = document.getElementById('password-cancel-btn');
        const confirmBtn = document.getElementById('password-confirm-btn');
    
        // 显示对话框
        dialog.style.display = 'flex';
        passwordInput.value = '';
        setTimeout(() => {
            passwordInput.focus();
        }, 50);
    
        // 处理登录逻辑
        const handleLogin = () => {
            const password = passwordInput.value.trim();
            if (password === '') {
                customAlert('请输入密码').then(() => {
                    passwordInput.focus();
                });
                return;
            }
    
            login(password).then(result => {
                if (result.valid) {
                    isLoggedIn = true;
                    localStorage.setItem('authToken', result.token);
                    console.log('Token saved:', result.token);
                    dialog.style.display = 'none';
                    loadLinks();
                    logAction('登录成功');
                    updateUIState();
                } else {
                    customAlert('密码错误');
                    logAction('登录失败', { reason: result.error || '密码错误' });
                }
            }).catch(error => {
                console.error('Login error:', error);
                customAlert('登录过程出错，请重试');
            });
        };
    
        // 取消按钮点击事件
        cancelBtn.onclick = function() {
            dialog.style.display = 'none';
            logAction('取消登录');
            cleanupEventListeners();
        };
    
        // 确定按钮点击事件
        confirmBtn.onclick = handleLogin;
    
        // 回车键触发确定按钮
        const handleKeyDown = (e) => {
			if (!dialog.contains(document.activeElement)) return;
            if (e.key === 'Enter') {
                e.preventDefault(); // 防止表单提交等默认行为
                handleLogin();
            } else if (e.key === 'Escape') {
                dialog.style.display = 'none';
                logAction('取消登录');
                cleanupEventListeners();
            }
        };
    
        // 清理事件监听器
        const cleanupEventListeners = () => {
            document.removeEventListener('keydown', handleKeyDown);
            dialog.removeEventListener('click', handleOutsideClick);
        };
    
        // 点击遮罩层关闭对话框
        const handleOutsideClick = (e) => {
            if (e.target === dialog) {
                dialog.style.display = 'none';
                logAction('取消登录');
                cleanupEventListeners();
            }
        };
    
        // 添加事件监听器
        document.addEventListener('keydown', handleKeyDown);
        dialog.addEventListener('click', handleOutsideClick);
    }
    
    // 应用暗色主题
    function applyDarkTheme() {
        document.body.classList.add('dark-theme');
        window.isDarkTheme = true;
        logAction('应用暗色主题');
    }

    let currentConfirmHandler = null;
    
    function showEditDialog(link) {
        document.getElementById('dialog-overlay').style.display = 'flex';
    
        document.getElementById('name-input').value = link.name;
        document.getElementById('url-input').value = link.url;
        document.getElementById('tips-input').value = link.tips || '';
        document.getElementById('icon-input').value = link.icon || '' ;
        document.getElementById('category-select').value = link.category;
        document.getElementById('private-checkbox').checked = link.isPrivate;
    
        const confirmBtn = document.getElementById('dialog-confirm-btn');
        const cancelBtn = document.getElementById('dialog-cancel-btn');
    
        cancelBtn.onclick = hideAddDialog;
        if (currentConfirmHandler) {
            confirmBtn.removeEventListener('click', currentConfirmHandler);
        }
    
        currentConfirmHandler = async function () {
            await updateLink(link);
        };
        confirmBtn.addEventListener('click', currentConfirmHandler);
    
        logAction('显示编辑链接对话框');
    }

    // 显示添加链接对话框
    function showAddDialog() {
        document.getElementById('dialog-overlay').style.display = 'flex';

        const nameInput = document.getElementById('name-input');
        nameInput.value = '';
        document.getElementById('url-input').value = '';
        document.getElementById('tips-input').value = '';
        document.getElementById('icon-input').value = '';
        document.getElementById('private-checkbox').checked = false;

        const confirmBtn = document.getElementById('dialog-confirm-btn');
        const cancelBtn = document.getElementById('dialog-cancel-btn');

        // 解绑旧监听器
        cancelBtn.onclick = hideAddDialog;
        if (currentConfirmHandler) {
            confirmBtn.removeEventListener('click', currentConfirmHandler);
        }

        // 绑定新的监听器
        currentConfirmHandler = async function () {
            await addLink();
        };
        confirmBtn.addEventListener('click', currentConfirmHandler);

        setTimeout(() => {
            nameInput.focus();
        }, 50);

        logAction('显示添加链接对话框');
    }

    
    // 隐藏添加链接对话框
    function hideAddDialog() {
        document.getElementById('dialog-overlay').style.display = 'none';
        logAction('隐藏添加链接对话框');
    }
    
    // 切换编辑卡片模式
    function toggleEditMode() {
        editCardMode = !editCardMode;
        const deleteButtons = document.querySelectorAll('.delete-card-btn');
        deleteButtons.forEach(btn => {
            btn.style.display = editCardMode ? 'block' : 'none';
        });
        const editButtons = document.querySelectorAll('.edit-card-btn');
        editButtons.forEach(btn => {
            btn.style.display = editCardMode ? 'block' : 'none';
        });
        document.getElementById('custom-tooltip').style.display = 'none';
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (editCardMode) {
                card.classList.add('no-hover'); // 添加禁用 hover 的类
            } else {
                card.classList.remove('no-hover'); // 移除禁用 hover 的类
            }
        });
        logAction('切换编辑卡片模式', { editCardMode });
    }
    
    //切换编辑删除分类模式
    function toggleEditCategory() {
        isEditCategoryMode = !isEditCategoryMode;
    
        const deleteButtons = document.querySelectorAll('.delete-category-btn');
        const editButtons = document.querySelectorAll('.edit-category-btn');
        const moveButtons = document.querySelectorAll('.move-category-btn');
    
        deleteButtons.forEach(btn => {
            btn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
        });
    
        editButtons.forEach(btn => {
            btn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
        });
    
        moveButtons.forEach(btn => {
            btn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
        });
    
        logAction('切换删除分类模式', { isEditCategoryMode });
    }
    
    
    const sunSvg = '<svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    const moonSvg = '<svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star-icon lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>';

    // 切换主题
    function toggleTheme() {
        window.isDarkTheme = !window.isDarkTheme;
        if (document.getElementById('save-preference-checkbox').checked) {
            localStorage.setItem('theme', window.isDarkTheme ? 'dark' : 'light');
        } else {
            // 关闭保存偏好时清除本地存储的主题设置
            localStorage.removeItem('theme');
        }
        const themeToggleButton = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        // 添加或移除暗色主题类
        if (window.isDarkTheme) {
            document.body.classList.add('dark-theme');
            themeIcon.outerHTML = sunSvg;
        } else {
            document.body.classList.remove('dark-theme');
            
            themeIcon.outerHTML = moonSvg;
        }

        updateThemeSwitchUI();

        logAction('切换主题', { isDarkTheme: window.isDarkTheme });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const themeIcon = document.getElementById('theme-icon');
        if (!themeIcon) return;
        themeIcon.outerHTML = window.isDarkTheme ? sunSvg : moonSvg;
    });

    // 返回顶部
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }   
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            handleBackToTopVisibility();
        }, 100); // 延迟一点点再判断滚动位置
    });
    
    window.addEventListener('scroll', handleBackToTopVisibility);
    
    function handleBackToTopVisibility() {
        const btn = document.getElementById('back-to-top-btn');
        if (!btn) return;
    
        // 如果页面滚动高度大于 300px，才显示按钮
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    }
    
    // 验证密码
    async function login(inputPassword) {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: inputPassword }),
        });
        const result = await response.json();
        return result;
    }
    
    // 初始化加载
    document.addEventListener('DOMContentLoaded', async () => {
        await validateToken(); 
        loadLinks(); 
    });


    // 前端检查是否有 token
    async function validateToken() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            isLoggedIn = false;
            updateUIState();
            return false;
        }

        try {
            const response = await fetch('/api/validateToken', {
				headers: { 'Authorization': token }
			});
            
            if (response.status === 401) {
                await resetToLoginState('token已过期，请重新登录'); 
                return false;
            }
            
            isLoggedIn = true;
            updateUIState();
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    // 重置状态
    async function resetToLoginState(message) {
        // alert(message);
        await customAlert(message);
        
        cleanupDragState();
        
        localStorage.removeItem('authToken');
        isLoggedIn = false;
        isAdmin = false;
        editCardMode = false;
        isEditCategoryMode = false;
        
        
        updateUIState();
        loadSections();
        
        const settingPanel = document.querySelector('.setting-panel');
        if (settingPanel) {
            settingPanel.style.display = 'none';
        }
        
        const selectors = [
            '.edit-card-btn',
            '.delete-card-btn',
            '.edit-category-btn',
            '.delete-category-btn',
            '.move-category-btn'
        ];
        
        document.querySelectorAll(selectors.join(', ')).forEach(btn => {
            btn.style.display = 'none';
        });
        
        const dialogOverlay = document.getElementById('dialog-overlay');
        if (dialogOverlay) {
            dialogOverlay.style.display = 'none';
        }
    }

    /**
     * 自定义弹窗 (替代 alert)
     * @param {string} message - 显示内容
     * @param {string} [title='提示'] - 标题
     * @param {string} [confirmText='确定'] - 按钮文字
     * @returns {Promise<void>} - 点击确定后 resolve
     */
    function customAlert(message, title = '提示', confirmText = '确定') {
		return new Promise((resolve) => {
			const overlay = document.getElementById('custom-alert-overlay');
			const box = document.getElementById('custom-alert-box');
			const titleEl = document.getElementById('custom-alert-title');
			const contentEl = document.getElementById('custom-alert-content');
			const confirmBtn = document.getElementById('custom-alert-confirm');
			
			titleEl.textContent = title;
			contentEl.textContent = message;
			confirmBtn.textContent = confirmText;
			
			overlay.style.display = 'flex';

			// 只在弹窗内监听键盘事件
			const handleKeyDown = (e) => {
				// 判断事件目标是否在弹窗内
				if (!box.contains(document.activeElement)) return;
				
				if (e.key === 'Escape' || e.key === 'Enter') {
				e.preventDefault();  // 阻止事件冒泡或默认行为，防止触发别处
				handleConfirm();
				}
			};

			const handleConfirm = () => {
				overlay.style.display = 'none';
				confirmBtn.removeEventListener('click', handleConfirm);
				document.removeEventListener('keydown', handleKeyDown);
				resolve();
			};

			confirmBtn.addEventListener('click', handleConfirm);
			document.addEventListener('keydown', handleKeyDown);
			
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) {
				handleConfirm();
				}
			});
		});
	}

        /**
         * 显示分类名称输入弹窗 (专用)
         * @param {string} title - 弹窗标题
         * @param {string} [defaultValue=''] - 默认值
         * @returns {Promise<string|null>} - 返回输入的字符串或null(取消)
         */
        function showCategoryDialog(title, defaultValue = '') {
			return new Promise((resolve) => {
				const dialog = document.getElementById('category-dialog');
				const input = document.getElementById('category-name-input');
				const titleEl = document.getElementById('category-dialog-title');
				const confirmBtn = document.getElementById('category-confirm-btn');
				const cancelBtn = document.getElementById('category-cancel-btn');

				titleEl.textContent = title;
				input.value = defaultValue;

				dialog.style.display = 'flex';
				setTimeout(() => input.focus(), 50);

				const handleConfirm = () => {
					const value = input.value.trim();
					if (value) {
						cleanup();
						resolve(value);
					} else {
						input.focus();
					}
				};

				const handleCancel = () => {
					cleanup();
					resolve(null);
				};

				const handleKeyDown = (e) => {
					// 只有当焦点在弹窗内时才响应
					if (!dialog.contains(document.activeElement)) return;

					if (e.key === 'Enter') {
						e.preventDefault();
						handleConfirm();
					}
					if (e.key === 'Escape') {
						e.preventDefault();
						handleCancel();
					}
				};

				const cleanup = () => {
					dialog.style.display = 'none';
					document.removeEventListener('keydown', handleKeyDown);
					confirmBtn.onclick = null;
					cancelBtn.onclick = null;
					dialog.onclick = null;
				};

				confirmBtn.onclick = handleConfirm;
				cancelBtn.onclick = handleCancel;
				document.addEventListener('keydown', handleKeyDown);
				dialog.onclick = (e) => e.target === dialog && handleCancel();
			});
		}

        /**
         * 自定义Confirm弹窗
         * @param {string} message - 提示消息
         * @param {string} [okText='确定'] - 确定按钮文字
         * @param {string} [cancelText='取消'] - 取消按钮文字
         * @returns {Promise<boolean>} - 返回用户选择(true=确定, false=取消)
         */
        function customConfirm(message, okText = '确定', cancelText = '取消') {
			return new Promise((resolve) => {
				const overlay = document.getElementById('custom-confirm-overlay');
				const messageEl = document.getElementById('custom-confirm-message');
				const okBtn = document.getElementById('custom-confirm-ok');
				const cancelBtn = document.getElementById('custom-confirm-cancel');

				messageEl.textContent = message;
				okBtn.textContent = okText;
				cancelBtn.textContent = cancelText;

				overlay.style.display = 'flex';

				const handleConfirm = (result) => {
					cleanup();
					resolve(result);
				};

				const handleKeyDown = (e) => {
					// 只有焦点在弹窗内时生效
					if (!overlay.contains(document.activeElement)) return;

					if (e.key === 'Enter') {
						e.preventDefault();
						handleConfirm(true);
					}
					if (e.key === 'Escape') {
						e.preventDefault();
						handleConfirm(false);
					}
				};

				const cleanup = () => {
					overlay.style.display = 'none';
					document.removeEventListener('keydown', handleKeyDown);
					okBtn.onclick = null;
					cancelBtn.onclick = null;
					overlay.onclick = null;
				};

				okBtn.onclick = () => handleConfirm(true);
				cancelBtn.onclick = () => handleConfirm(false);
				document.addEventListener('keydown', handleKeyDown);
				overlay.onclick = (e) => e.target === overlay && handleConfirm(false);
			});
		}

        function showLoading(message = '加载中，请稍候...') {
            const mask = document.getElementById('loading-mask');
            const textElement = mask.querySelector('p');
            textElement.textContent = message;
            mask.style.display = 'flex';
        }
        
        function hideLoading() {
            const mask = document.getElementById('loading-mask');
            mask.style.display = 'none';
        }


        function handleTooltipMouseMove(e, tips, isAdmin) {
            const tooltip = document.getElementById('custom-tooltip');
        
            if (!tips || isAdmin) {
                tooltip.style.display = 'none';
                return;
            }
        
            // 设置提示内容
            if (tooltip.textContent !== tips) {
                tooltip.textContent = tips;
            }
        
            tooltip.style.display = 'block';
        
            const offsetX = 15;
            const offsetY = 10;
        
            const tooltipRect = tooltip.getBoundingClientRect();
            const pageWidth = window.innerWidth;
            const pageHeight = window.innerHeight;
        
            let left = e.pageX + offsetX;
            let top = e.pageY + offsetY;
        
            if (pageWidth - e.clientX < 200) {
                left = e.pageX - tooltipRect.width - offsetX;
            }
            // 如果距离底部小于100像素，往上显示
            if (pageHeight - e.clientY < 100) {
                top = e.pageY - tooltipRect.height - offsetY;
            }
        
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }
        
        function handleTooltipMouseLeave() {
            const tooltip = document.getElementById('custom-tooltip');
            tooltip.style.display = 'none';
        }

		// 导出数据功能
		async function exportData() {
			if (!(await validateToken())) {
				return;
			}

			const confirmed = await customConfirm("确定要导出数据吗？");
			if (!confirmed) {
				return; 
			}

			try {
				showLoading("正在导出数据...");

				const response = await fetch("/api/exportData", {
					method: "POST",
					headers: {
						"Authorization": localStorage.getItem("authToken")
					}
				});

				if (!response.ok) {
					throw new Error("导出失败");
				}

				const data = await response.json();

				// 创建 Blob 并触发下载
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
				const url = URL.createObjectURL(blob);

				const a = document.createElement("a");
				a.href = url;
				var date = new Date().toISOString().split("T")[0];
				a.download = "export_datas_" + date + ".json";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				logAction("数据导出成功");
			} catch (error) {
				logAction("数据导出失败", { error: error.message });
				customConfirm("导出失败，请重试");
			} finally {
				hideLoading();
			}
		}

    </script>
</body>

</html>
`;

function base64UrlEncode(str) {
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeUint8(arr) {
	const str = String.fromCharCode(...arr);
	return base64UrlEncode(str);
}

function base64UrlDecode(str) {
	str = str.replace(/-/g, '+').replace(/_/g, '/');
	while (str.length % 4) str += '=';
	return atob(str);
}

async function createJWT(payload, secret) {
	const encoder = new TextEncoder();
	const header = {
		alg: 'HS256',
		typ: 'JWT',
	};

	const headerEncoded = base64UrlEncode(JSON.stringify(header));
	const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
	const toSign = encoder.encode(`${headerEncoded}.${payloadEncoded}`);

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{
			name: 'HMAC',
			hash: 'SHA-256',
		},
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign('HMAC', key, toSign);
	const signatureEncoded = base64UrlEncodeUint8(new Uint8Array(signature));

	return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

async function validateJWT(token, secret) {
	const encoder = new TextEncoder();
	const parts = token.split('.');
	if (parts.length !== 3) return null;

	const [headerEncoded, payloadEncoded, signature] = parts;
	const data = encoder.encode(`${headerEncoded}.${payloadEncoded}`);

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{
			name: 'HMAC',
			hash: 'SHA-256',
		},
		false,
		['sign']
	);

	const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, data);
	const expectedSig = base64UrlEncodeUint8(new Uint8Array(expectedSigBuffer));

	if (signature !== expectedSig) return null;

	const payloadStr = base64UrlDecode(payloadEncoded);
	return JSON.parse(payloadStr);
}

// 服务端 token 验证
async function validateServerToken(authHeader, env) {
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return {
			isValid: false,
			status: 401,
			response: {
				error: 'Unauthorized',
				message: '未登录或登录已过期',
			},
		};
	}

	const token = authHeader.slice(7);
	const payload = await validateJWT(token, env.ADMIN_PASSWORD);
	if (!payload) {
		return {
			isValid: false,
			status: 401,
			response: {
				error: 'Invalid token',
				tokenInvalid: true,
				message: '登录状态无效，请重新登录',
			},
		};
	}

	const now = Math.floor(Date.now() / 1000);
	if (payload.exp < now) {
		return {
			isValid: false,
			status: 401,
			response: {
				error: 'Token expired',
				tokenExpired: true,
				message: '登录已过期，请重新登录',
			},
		};
	}

	return {
		isValid: true,
		payload,
	};
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === '/') {
			return new Response(HTML_CONTENT, {
				headers: {
					'Content-Type': 'text/html',
				},
			});
		}

		if (url.pathname === '/api/validateToken') {
			const authToken = request.headers.get('Authorization');
			const validation = await validateServerToken(authToken, env);

			if (!validation.isValid) {
				return new Response(JSON.stringify(validation.response), {
					status: validation.status,
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}

			return new Response(
				JSON.stringify({
					valid: true,
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		if (url.pathname === '/api/getLinks') {
			const userId = url.searchParams.get('userId');
			const authToken = request.headers.get('Authorization');
			const data = await env.CARD_ORDER.get(userId);

			if (data) {
				const parsedData = JSON.parse(data);

				// 如果提供 token，尝试验证
				if (authToken) {
					const validation = await validateServerToken(authToken, env);
					if (!validation.isValid) {
						return new Response(JSON.stringify(validation.response), {
							status: validation.status,
							headers: {
								'Content-Type': 'application/json',
							},
						});
					}

					// token 合法，返回完整数据
					return new Response(JSON.stringify(parsedData), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					});
				}

				// 未提供 token，过滤掉私有链接
				const filteredCategories = {};
				for (const category in parsedData.categories) {
					filteredCategories[category] = parsedData.categories[category].filter((link) => !link.isPrivate);
				}

				return new Response(
					JSON.stringify({
						categories: filteredCategories,
					}),
					{
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
			}

			return new Response(
				JSON.stringify({
					categories: {},
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		if (url.pathname === '/api/saveOrder' && request.method === 'POST') {
			const authToken = request.headers.get('Authorization');
			const validation = await validateServerToken(authToken, env);

			if (!validation.isValid) {
				return new Response(JSON.stringify(validation.response), {
					status: validation.status,
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}

			const { userId, links, categories } = await request.json();
			await env.CARD_ORDER.put(
				userId,
				JSON.stringify({
					links,
					categories,
				})
			);
			return new Response(
				JSON.stringify({
					success: true,
					message: '保存成功',
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		if (url.pathname === '/api/login' && request.method === 'POST') {
			try {
				const { password } = await request.json();
				if (password !== env.ADMIN_PASSWORD) {
					return new Response(
						JSON.stringify({
							valid: false,
						}),
						{
							status: 403,
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
				}

				const now = Math.floor(Date.now() / 1000);
				const payload = {
					iat: now,
					exp: now + 15 * 60, // 15分钟有效
					role: 'admin',
				};

				const token = await createJWT(payload, env.ADMIN_PASSWORD);

				return new Response(
					JSON.stringify({
						valid: true,
						token: `Bearer ${token}`,
					}),
					{
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
			} catch (error) {
				return new Response(
					JSON.stringify({
						valid: false,
						error: error.message,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
			}
		}

		if (url.pathname === '/api/backupData' && request.method === 'POST') {
            const authToken = request.headers.get('Authorization');
            const validation = await validateServerToken(authToken, env);

            if (!validation.isValid) {
                return new Response(JSON.stringify(validation.response), {
                    status: validation.status,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            try {
                const { sourceUserId } = await request.json();
                const result = await this.backupData(env, sourceUserId);
                return new Response(JSON.stringify(result), {
                status: result.success ? 200 : 404,
                headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    message: '备份操作失败'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

		if (url.pathname === '/api/exportData' && request.method === 'POST') {
			const authToken = request.headers.get('Authorization');
            const validation = await validateServerToken(authToken, env);

            if (!validation.isValid) {
                return new Response(JSON.stringify(validation.response), {
                    status: validation.status,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

			try {
				const storedData = await env.CARD_ORDER.get('testUser');
				const parsedData = storedData
					? JSON.parse(storedData)
					: {
							categories: {},
					  };

				return new Response(JSON.stringify(parsedData, null, 2), {
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						'Content-Disposition': 'attachment; filename="links_export.json"',
					},
				});
			} catch (error) {
				return new Response(
					JSON.stringify({
						success: false,
						message: '读取数据失败',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
			}
		}

		return new Response('Not Found', {
			status: 404,
		});
	},

	async backupData(env, sourceUserId) {
		const MAX_BACKUPS = 10;
		const sourceData = await env.CARD_ORDER.get(sourceUserId);

		if (sourceData) {
			try {
				const currentDate = new Date()
					.toLocaleString('zh-CN', {
						timeZone: 'Asia/Shanghai',
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
						hour12: false,
					})
					.replace(/\//g, '-');

				const backupId = `backup_${currentDate}`;

				const backups = await env.CARD_ORDER.list({
					prefix: 'backup_',
				});
				const backupKeys = backups.keys
					.map((key) => key.name)
					.sort((a, b) => {
						const timeA = new Date(a.split('_')[1].replace(/-/g, '/')).getTime();
						const timeB = new Date(b.split('_')[1].replace(/-/g, '/')).getTime();
						return timeB - timeA; // 降序排序，最新的在前
					});

				await env.CARD_ORDER.put(backupId, sourceData);

				const allBackups = [...backupKeys, backupId].sort((a, b) => {
					const timeA = new Date(a.split('_')[1].replace(/-/g, '/')).getTime();
					const timeB = new Date(b.split('_')[1].replace(/-/g, '/')).getTime();
					return timeB - timeA;
				});

				const backupsToDelete = allBackups.slice(MAX_BACKUPS);

				if (backupsToDelete.length > 0) {
					await Promise.all(backupsToDelete.map((key) => env.CARD_ORDER.delete(key)));
				}

				return {
					success: true,
					backupId,
					remainingBackups: MAX_BACKUPS,
					deletedCount: backupsToDelete.length,
				};
			} catch (error) {
				return {
					success: false,
					error: 'Backup operation failed',
					details: error.message,
				};
			}
		}
		return {
			success: false,
			error: 'Source data not found',
		};
	},
};
