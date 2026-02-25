/* ============================================
   生日解谜应用 - JavaScript 脚本
   功能：管理谜题交互、答案验证和胜利检测
   ============================================ */

/**
 * 谜题状态管理对象
 * 跟踪三个谜题是否已解决
 */
const puzzleState = {
    jiyi: false,
    kesong: false,
    q_mark: false
};

/**
 * 答案验证规则
 * 定义每个谜题的正确答案
 */
const answerKey = {
    jiyi: '5.1',
    kesong: null,  // 任意输入都算对
    q_mark: '7.18'
};

/**
 * 初始化应用
 * 页面加载完成后绑定所有事件监听
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

/**
 * 初始化所有事件监听器
 */
function initializeEventListeners() {
    // 绑定图标点击事件
    bindIconListeners();
    
    // 绑定模态框相关事件
    bindModalListeners();
}

/**
 * 绑定图标点击事件
 * 点击图标打开对应的模态框
 */
function bindIconListeners() {
    const jiyi = document.getElementById('jiyi-icon-wrapper');
    const kesong = document.getElementById('kesong-icon-wrapper');
    const qMark = document.getElementById('q-mark-icon-wrapper');
    
    jiyi.addEventListener('click', function() {
        if (!puzzleState.jiyi) {
            openModal('jiyi-modal');
        }
    });
    
    kesong.addEventListener('click', function() {
        if (!puzzleState.kesong) {
            openModal('kesong-modal');
        }
    });
    
    qMark.addEventListener('click', function() {
        if (!puzzleState.q_mark) {
            openModal('q-mark-modal');
        }
    });
}

/**
 * 绑定模态框事件
 * 包括遮罩点击关闭和提交按钮
 */
function bindModalListeners() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal-overlay');
        const submitBtn = modal.querySelector('.submit-btn');
        
        // 点击遮罩关闭模态框
        overlay.addEventListener('click', function() {
            closeModal(modal.id);
        });
        
        // 绑定提交按钮
        submitBtn.addEventListener('click', function() {
            handleSubmit(modal.id);
        });
        
        // 支持按 Enter 键提交
        const input = modal.querySelector('.answer-input');
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSubmit(modal.id);
            }
        });
    });
}

/**
 * 打开模态框
 * @param {string} modalId - 模态框的 ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        // 自动聚焦输入框
        const input = modal.querySelector('.answer-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
}

/**
 * 关闭模态框
 * @param {string} modalId - 模态框的 ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // 清空输入框
        const input = modal.querySelector('.answer-input');
        if (input) {
            input.value = '';
        }
    }
}

/**
 * 处理提交按钮点击
 * 验证答案并更新状态
 * @param {string} modalId - 模态框的 ID
 */
function handleSubmit(modalId) {
    const modal = document.getElementById(modalId);
    const input = modal.querySelector('.answer-input');
    const answer = input.value.trim();
    
    // 确定对应的谜题类型
    let puzzleType;
    if (modalId === 'jiyi-modal') {
        puzzleType = 'jiyi';
    } else if (modalId === 'kesong-modal') {
        puzzleType = 'kesong';
    } else if (modalId === 'q-mark-modal') {
        puzzleType = 'q_mark';
    }
    
    // 检查答案
    if (checkAnswer(puzzleType, answer)) {
        // 答案正确，更新状态
        puzzleState[puzzleType] = true;
        
        // 为对应的图标添加 .solved 类
        updateIconState(puzzleType);
        
        // 关闭模态框
        closeModal(modalId);
        
        // 检查是否通关
        checkForWin();
    } else {
        // 答案错误，显示提示
        alert('答案不对，请再试一次！');
        input.value = '';
    }
}

/**
 * 检查答案是否正确
 * @param {string} puzzleType - 谜题类型 ('jiyi', 'kesong', 'q_mark')
 * @param {string} answer - 用户输入的答案
 * @returns {boolean} 答案是否正确
 */
function checkAnswer(puzzleType, answer) {
    if (!answer) {
        alert('请输入答案！');
        return false;
    }
    
    const correctAnswer = answerKey[puzzleType];
    
    // 如果 correctAnswer 为 null，则任意输入都算正确（kesong）
    if (correctAnswer === null) {
        return true;
    }
    
    // 否则比较答案（需要精确匹配）
    return answer === correctAnswer;
}

/**
 * 更新图标状态
 * 为已解决的图标添加 .solved 类
 * @param {string} puzzleType - 谜题类型
 */
function updateIconState(puzzleType) {
    let wrapper;
    
    if (puzzleType === 'jiyi') {
        wrapper = document.getElementById('jiyi-icon-wrapper');
    } else if (puzzleType === 'kesong') {
        wrapper = document.getElementById('kesong-icon-wrapper');
    } else if (puzzleType === 'q_mark') {
        wrapper = document.getElementById('q-mark-icon-wrapper');
    }
    
    if (wrapper) {
        wrapper.classList.add('solved');
    }
}

/**
 * 检查是否通关
 * 所有谜题都解决时显示庆祝屏幕
 */
function checkForWin() {
    const allSolved = puzzleState.jiyi && puzzleState.kesong && puzzleState.q_mark;
    
    if (allSolved) {
        // 延迟显示庆祝屏幕，给用户时间看到最后一个图标变灰
        setTimeout(() => {
            showCelebrationScreen();
        }, 500);
    }
}

/**
 * 显示庆祝屏幕并触发烟花动画
 */
function showCelebrationScreen() {
    const celebrationScreen = document.getElementById('celebration-screen');
    celebrationScreen.classList.remove('hidden');
    
    // 触发烟花动画
    createFireworks();
}

/**
 * 创建烟花动画效果
 * 在屏幕上生成多个粒子并执行爆炸动画
 */
function createFireworks() {
    const container = document.querySelector('.fireworks-container');
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        // 创建粒子元素
        const particle = document.createElement('div');
        particle.className = 'fireworks-particle particle';
        
        // 随机选择颜色（暖色调）
        const colors = ['#F28F6B', '#FFB84D', '#FFD700', '#FF6B6B', '#FF8C94'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        
        // 随机初始位置（屏幕中心）
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        // 计算随机方向和距离
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 150 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        // 设置 CSS 变量用于动画
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        // 添加到容器
        container.appendChild(particle);
        
        // 动画完成后移除元素
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // 持续产生烟花（每400ms一束）
    let fireworksCount = 0;
    const fireworksInterval = setInterval(() => {
        if (fireworksCount >= 3) {
            clearInterval(fireworksInterval);
            return;
        }
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'fireworks-particle particle';
            
            const colors = ['#F28F6B', '#FFB84D', '#FFD700', '#FF6B6B', '#FF8C94'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = randomColor;
            
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
        
        fireworksCount++;
    }, 400);
}

/* ============================================
   控制台日志
   ============================================ */
console.log('🎂 生日解谜应用已加载！');
console.log('答案提示：');
console.log('- 吉伊的谜题答案：5.1');
console.log('- 可颂的谜题答案：任意即可');
console.log('- 问号的谜题答案：7.18');
