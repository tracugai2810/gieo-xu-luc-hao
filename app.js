/* ========================================
   LỤC HÀO WEBAPP - JAVASCRIPT
   All divination logic and UI interactions
   ======================================== */

// ============================================
// CONSTANTS & DATA
// ============================================

// 10 Thiên Can
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// 12 Địa Chi
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Ngũ hành của từng Chi
const NGU_HANH_CHI = {
    'Hợi': 'Thủy', 'Tý': 'Thủy',
    'Dần': 'Mộc', 'Mão': 'Mộc',
    'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa',
    'Thân': 'Kim', 'Dậu': 'Kim',
    'Thìn': 'Thổ', 'Tuất': 'Thổ', 'Sửu': 'Thổ', 'Mùi': 'Thổ'
};

// Ngũ hành của 8 quái
const NGU_HANH_QUAI = {
    'Càn': 'Kim', 'Đoài': 'Kim',
    'Ly': 'Hỏa',
    'Chấn': 'Mộc', 'Tốn': 'Mộc',
    'Khảm': 'Thủy',
    'Cấn': 'Thổ', 'Khôn': 'Thổ'
};

// 8 Quái đơn với mã nhị phân
const QUAI_SO = [
    { name: 'Khôn', bin: '000', hanh: 'Thổ' },
    { name: 'Cấn', bin: '001', hanh: 'Thổ' },
    { name: 'Khảm', bin: '010', hanh: 'Thủy' },
    { name: 'Tốn', bin: '011', hanh: 'Mộc' },
    { name: 'Chấn', bin: '100', hanh: 'Mộc' },
    { name: 'Ly', bin: '101', hanh: 'Hỏa' },
    { name: 'Đoài', bin: '110', hanh: 'Kim' },
    { name: 'Càn', bin: '111', hanh: 'Kim' }
];

// Bảng Mai Hoa (chuyển số sang 3 hào)
const MAI_HOA_BITS = {
    1: [1, 1, 1], 2: [1, 1, 2], 3: [1, 2, 1], 4: [1, 2, 2],
    5: [2, 1, 1], 6: [2, 1, 2], 7: [2, 2, 1], 8: [2, 2, 2], 0: [2, 2, 2]
};

// Bảng Nạp Giáp (6 chi cho mỗi quái)
const NAP_GIAP = {
    'Càn': ['Tý', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất'],
    'Khảm': ['Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất', 'Tý'],
    'Cấn': ['Thìn', 'Ngọ', 'Thân', 'Tuất', 'Tý', 'Dần'],
    'Chấn': ['Tý', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất'],
    'Tốn': ['Sửu', 'Hợi', 'Dậu', 'Mùi', 'Tỵ', 'Mão'],
    'Ly': ['Mão', 'Sửu', 'Hợi', 'Dậu', 'Mùi', 'Tỵ'],
    'Khôn': ['Mùi', 'Tỵ', 'Mão', 'Sửu', 'Hợi', 'Dậu'],
    'Đoài': ['Tỵ', 'Mão', 'Sửu', 'Hợi', 'Dậu', 'Mùi']
};

// Ma trận 64 quẻ: TEN_QUE[Ngoại quái][Nội quái]
const TEN_QUE = [
    ['Bát Thuần Khôn', 'Địa Sơn Khiêm', 'Địa Thủy Sư', 'Địa Phong Thăng', 'Địa Lôi Phục', 'Địa Hỏa Minh Di', 'Địa Trạch Lâm', 'Địa Thiên Thái'],
    ['Sơn Địa Bác', 'Bát Thuần Cấn', 'Sơn Thủy Mông', 'Sơn Phong Cổ', 'Sơn Lôi Di', 'Sơn Hỏa Bí', 'Sơn Trạch Tổn', 'Sơn Thiên Đại Súc'],
    ['Thủy Địa Tỷ', 'Thủy Sơn Kiển', 'Bát Thuần Khảm', 'Thủy Phong Tỉnh', 'Thủy Lôi Truân', 'Thủy Hỏa Ký Tế', 'Thủy Trạch Tiết', 'Thủy Thiên Nhu'],
    ['Phong Địa Quan', 'Phong Sơn Tiệm', 'Phong Thủy Hoán', 'Bát Thuần Tốn', 'Phong Lôi Ích', 'Phong Hỏa Gia Nhân', 'Phong Trạch Trung Phu', 'Phong Thiên Tiểu Súc'],
    ['Lôi Địa Dự', 'Lôi Sơn Tiểu Quá', 'Lôi Thủy Giải', 'Lôi Phong Hằng', 'Bát Thuần Chấn', 'Lôi Hỏa Phong', 'Lôi Trạch Quy Muội', 'Lôi Thiên Đại Tráng'],
    ['Hỏa Địa Tấn', 'Hỏa Sơn Lữ', 'Hỏa Thủy Vị Tế', 'Hỏa Phong Đỉnh', 'Hỏa Lôi Phệ Hạp', 'Bát Thuần Ly', 'Hỏa Trạch Khuê', 'Hỏa Thiên Đại Hữu'],
    ['Trạch Địa Tụy', 'Trạch Sơn Hàm', 'Trạch Thủy Khốn', 'Trạch Phong Đại Quá', 'Trạch Lôi Tùy', 'Trạch Hỏa Cách', 'Bát Thuần Đoài', 'Trạch Thiên Quải'],
    ['Thiên Địa Bĩ', 'Thiên Sơn Độn', 'Thiên Thủy Tụng', 'Thiên Phong Cấu', 'Thiên Lôi Vô Vọng', 'Thiên Hỏa Đồng Nhân', 'Thiên Trạch Lý', 'Bát Thuần Càn']
];

// Danh sách quẻ Lục Xung (ngoài Bát Thuần)
const LUC_XUNG_LIST = ['Thiên Lôi Vô Vọng', 'Lôi Thiên Đại Tráng'];

// Danh sách quẻ Lục Hợp
const LUC_HOP_LIST = [
    'Thiên Địa Bĩ', 'Địa Thiên Thái',
    'Thủy Trạch Tiết', 'Trạch Thủy Khốn',
    'Sơn Hỏa Bí', 'Hỏa Sơn Lữ',
    'Địa Lôi Phục', 'Lôi Địa Dự'
];

function getHexAttribute(hexName, type) {
    if (type === 'Du Hồn') return 'Du Hồn';
    if (type === 'Quy Hồn') return 'Quy Hồn';
    if (type === 'Bát Thuần' || LUC_XUNG_LIST.includes(hexName)) return 'Lục Xung';
    if (LUC_HOP_LIST.includes(hexName)) return 'Lục Hợp';
    return '';
}

// Các cặp Quái Phản Ngâm (xung nhau)
const PHAN_NGAM_PAIRS = {
    7: 3, 3: 7,  // Càn ↔ Tốn
    5: 2, 2: 5,  // Ly ↔ Khảm
    4: 6, 6: 4,  // Chấn ↔ Đoài
    1: 0, 0: 1   // Cấn ↔ Khôn
};

// Cặp Quái Phục Ngâm (Càn ↔ Chấn, cùng hệ nạp chi)
const PHUC_NGAM_PAIRS = {
    7: 4, 4: 7   // Càn ↔ Chấn
};

// Hàm kiểm tra Phản Ngâm / Phục Ngâm ở cấp độ Quẻ
function checkNgam(mainInIdx, mainOutIdx, changedInIdx, changedOutIdx) {
    let noiResult = '';
    let ngoaiResult = '';

    // Kiểm tra Nội quái (hào 1-3)
    if (mainInIdx !== changedInIdx) {
        if (PHUC_NGAM_PAIRS[mainInIdx] === changedInIdx) {
            noiResult = 'phuc';
        } else if (PHAN_NGAM_PAIRS[mainInIdx] === changedInIdx) {
            noiResult = 'phan';
        }
    }

    // Kiểm tra Ngoại quái (hào 4-6)
    if (mainOutIdx !== changedOutIdx) {
        if (PHUC_NGAM_PAIRS[mainOutIdx] === changedOutIdx) {
            ngoaiResult = 'phuc';
        } else if (PHAN_NGAM_PAIRS[mainOutIdx] === changedOutIdx) {
            ngoaiResult = 'phan';
        }
    }

    // Tổng hợp kết quả
    const results = [];

    // Toàn quẻ
    if (noiResult && ngoaiResult && noiResult === ngoaiResult) {
        if (noiResult === 'phan') results.push('Toàn Quẻ Phản Ngâm');
        else results.push('Toàn Quẻ Phục Ngâm');
        return results;
    }

    // Từng quái riêng lẻ
    if (ngoaiResult === 'phan') results.push('Ngoại Quái Phản Ngâm');
    else if (ngoaiResult === 'phuc') results.push('Ngoại Quái Phục Ngâm');

    if (noiResult === 'phan') results.push('Nội Quái Phản Ngâm');
    else if (noiResult === 'phuc') results.push('Nội Quái Phục Ngâm');

    return results;
}

// Bảng tra thông tin 64 quẻ (Họ quái, Thế hào, Loại)
const HEX_MAP = {};

function initHexMap() {
    const add = (o, i, p, shi, t) => {
        HEX_MAP[(o << 3) | i] = { p, shi, type: t };
    };
    // Càn cung
    add(7, 7, 7, 6, 'Bát Thuần'); add(7, 3, 7, 1, ''); add(7, 1, 7, 2, ''); add(7, 0, 7, 3, '');
    add(3, 0, 7, 4, ''); add(1, 0, 7, 5, ''); add(5, 0, 7, 4, 'Du Hồn'); add(5, 7, 7, 3, 'Quy Hồn');
    // Khảm cung
    add(2, 2, 2, 6, 'Bát Thuần'); add(2, 6, 2, 1, ''); add(2, 4, 2, 2, ''); add(2, 5, 2, 3, '');
    add(6, 5, 2, 4, ''); add(4, 5, 2, 5, ''); add(0, 5, 2, 4, 'Du Hồn'); add(0, 2, 2, 3, 'Quy Hồn');
    // Cấn cung
    add(1, 1, 1, 6, 'Bát Thuần'); add(1, 5, 1, 1, ''); add(1, 7, 1, 2, ''); add(1, 6, 1, 3, '');
    add(5, 6, 1, 4, ''); add(7, 6, 1, 5, ''); add(3, 6, 1, 4, 'Du Hồn'); add(3, 1, 1, 3, 'Quy Hồn');
    // Chấn cung
    add(4, 4, 4, 6, 'Bát Thuần'); add(4, 0, 4, 1, ''); add(4, 2, 4, 2, ''); add(4, 3, 4, 3, '');
    add(0, 3, 4, 4, ''); add(2, 3, 4, 5, ''); add(6, 3, 4, 4, 'Du Hồn'); add(6, 4, 4, 3, 'Quy Hồn');
    // Tốn cung
    add(3, 3, 3, 6, 'Bát Thuần'); add(3, 7, 3, 1, ''); add(3, 5, 3, 2, ''); add(3, 4, 3, 3, '');
    add(7, 4, 3, 4, ''); add(5, 4, 3, 5, ''); add(1, 4, 3, 4, 'Du Hồn'); add(1, 3, 3, 3, 'Quy Hồn');
    // Ly cung
    add(5, 5, 5, 6, 'Bát Thuần'); add(5, 1, 5, 1, ''); add(5, 3, 5, 2, ''); add(5, 2, 5, 3, '');
    add(1, 2, 5, 4, ''); add(3, 2, 5, 5, ''); add(7, 2, 5, 4, 'Du Hồn'); add(7, 5, 5, 3, 'Quy Hồn');
    // Khôn cung
    add(0, 0, 0, 6, 'Bát Thuần'); add(0, 4, 0, 1, ''); add(0, 6, 0, 2, ''); add(0, 7, 0, 3, '');
    add(4, 7, 0, 4, ''); add(6, 7, 0, 5, ''); add(2, 7, 0, 4, 'Du Hồn'); add(2, 0, 0, 3, 'Quy Hồn');
    // Đoài cung
    add(6, 6, 6, 6, 'Bát Thuần'); add(6, 2, 6, 1, ''); add(6, 0, 6, 2, ''); add(6, 1, 6, 3, '');
    add(2, 1, 6, 4, ''); add(0, 1, 6, 5, ''); add(4, 1, 6, 4, 'Du Hồn'); add(4, 6, 6, 3, 'Quy Hồn');
}
initHexMap();

// 12 cung Trường Sinh (viết tắt)
const LIFE_STAGES = ['T.Sinh', 'M.Dục', 'Q.Đới', 'L.Quan', 'Đ.Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
const LS_START = { 'Hỏa': 2, 'Kim': 5, 'Mộc': 11, 'Thủy': 8, 'Thổ': 8 };

// Lục Thú theo Can ngày
const LUC_THU = {
    'Giáp': ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'],
    'Ất': ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'],
    'Bính': ['Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ', 'Thanh Long'],
    'Đinh': ['Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ', 'Thanh Long'],
    'Mậu': ['Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ', 'Thanh Long', 'Chu Tước'],
    'Kỷ': ['Đằng Xà', 'Bạch Hổ', 'Huyền Vũ', 'Thanh Long', 'Chu Tước', 'Câu Trần'],
    'Canh': ['Bạch Hổ', 'Huyền Vũ', 'Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà'],
    'Tân': ['Bạch Hổ', 'Huyền Vũ', 'Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà'],
    'Nhâm': ['Huyền Vũ', 'Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ'],
    'Quý': ['Huyền Vũ', 'Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ'],
};

// Store generated image data URL
let currentImageDataUrl = null;
let currentImageBlob = null;
let currentHexData = null;
let currentTuViData = null;
let currentTabType = 'default';

// ============================================
// CALENDAR CALCULATION (Tính Can Chi)
// ============================================

function getSolarTerm(year) {
    const termInfo = [];
    for (let i = 0; i < 24; i++) {
        termInfo.push(calculateSolarTermDate(year, i));
    }
    return termInfo;
}

function calculateSolarTermDate(year, termIndex) {
    const baseDate = new Date(Date.UTC(year, 0, 1));
    const approxDays = termIndex * 15.218 + 5.5;
    let jd = (baseDate.getTime() / 86400000) + 2440587.5 + approxDays;
    let targetLong = (285 + termIndex * 15) % 360;

    for (let k = 0; k < 3; k++) {
        const t = (jd - 2451545.0) / 36525.0;
        const L0 = 280.46646 + 36000.76983 * t;
        const M = 357.52911 + 35999.05029 * t;
        const C = (1.914602 - 0.004817 * t) * Math.sin(M * Math.PI / 180) + (0.019993) * Math.sin(2 * M * Math.PI / 180);
        let trueLong = (L0 + C) % 360;
        if (trueLong < 0) trueLong += 360;
        let error = targetLong - trueLong;
        if (error > 180) error -= 360;
        if (error < -180) error += 360;
        jd += error / 0.9856;
    }

    const z = Math.floor(jd + 0.5);
    const f = jd + 0.5 - z;
    let alpha = Math.floor((z - 1867216.25) / 36524.25);
    const a = z + 1 + alpha - Math.floor(alpha / 4);
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const day = b - d - Math.floor(30.6001 * e) + f;
    const month = e < 14 ? e - 1 : e - 13;
    const yy = month > 2 ? c - 4716 : c - 4715;
    const totalSec = Math.floor((day - Math.floor(day)) * 86400);

    return new Date(Date.UTC(yy, month - 1, Math.floor(day), Math.floor(totalSec / 3600), Math.floor((totalSec % 3600) / 60)));
}

const GAN_MAP = { '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu', '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý' };
const ZHI_MAP = { '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi' };
const SOLAR_TERM_NAMES_VI = {
    '立春': 'Lập Xuân', '雨水': 'Vũ Thủy', '惊蛰': 'Kinh Trập', '春分': 'Xuân Phân',
    '清明': 'Thanh Minh', '谷雨': 'Cốc Vũ', '立夏': 'Lập Hạ', '小满': 'Tiểu Mãn',
    '芒种': 'Mang Chủng', '夏至': 'Hạ Chí', '小暑': 'Tiểu Thử', '大暑': 'Đại Thử',
    '立秋': 'Lập Thu', '处暑': 'Xử Thử', '白露': 'Bạch Lộ', '秋分': 'Thu Phân',
    '寒露': 'Hàn Lộ', '霜降': 'Sương Giáng', '立冬': 'Lập Đông', '小雪': 'Tiểu Tuyết',
    '大雪': 'Đại Tuyết', '冬至': 'Đông Chí', '小寒': 'Tiểu Hàn', '大寒': 'Đại Hàn'
};

function getExactSolarTermName(actualDate, y, terms, termsPrev) {
    const termNames = ['Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập', 'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng', 'Hạ Chí', 'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ', 'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết', 'Đông Chí'];
    if (actualDate < terms[0]) {
        if (actualDate >= termsPrev[23]) return termNames[23];
        if (actualDate >= termsPrev[22]) return termNames[22];
        return termNames[23];
    }
    for (let i = 23; i >= 0; i--) {
        if (actualDate >= terms[i]) {
            return termNames[i];
        }
    }
    return termNames[0];
}

function parseDatePartsWithTimezone(dateInput) {
    let input = String(dateInput).trim();
    if (!input.includes('Z') && !input.includes('+') && !input.match(/-\d{2}:\d{2}$/)) {
        const tzEl = typeof document !== 'undefined' ? document.getElementById('inputTimezone') : null;
        input = input + (tzEl ? tzEl.value : (window.customTimezone || '+07:00'));
    }
    const actualDate = new Date(input);
    let targetYear, targetMonth, targetDay, targetHour, targetMinute;

    const tzMatch = input.match(/([+-]\d{2}):?(\d{2})$/);
    if (tzMatch) {
        const sign = tzMatch[1].startsWith('-') ? -1 : 1;
        const tzHours = parseInt(tzMatch[1].replace('+', '').replace('-', ''), 10);
        const tzMins = parseInt(tzMatch[2], 10);
        const offsetTotalMinutes = sign * (tzHours * 60 + tzMins);
        
        const targetLocalMs = actualDate.getTime() + offsetTotalMinutes * 60000;
        const targetDateObj = new Date(targetLocalMs);
        targetYear = targetDateObj.getUTCFullYear();
        targetMonth = targetDateObj.getUTCMonth() + 1;
        targetDay = targetDateObj.getUTCDate();
        targetHour = targetDateObj.getUTCHours();
        targetMinute = targetDateObj.getUTCMinutes();
    } else {
        targetYear = actualDate.getFullYear();
        targetMonth = actualDate.getMonth() + 1;
        targetDay = actualDate.getDate();
        targetHour = actualDate.getHours();
        targetMinute = actualDate.getMinutes();
    }
    return { actualDate, targetYear, targetMonth, targetDay, targetHour, targetMinute };
}

function calculateCanChi(dateInput) {
    const { actualDate, targetYear, targetMonth, targetDay, targetHour, targetMinute } = parseDatePartsWithTimezone(dateInput);

    // Tính Can Chi Ngày và Giờ theo giờ địa phương của nơi gieo quẻ
    let dayCalc = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute));
    if (targetHour >= 23) {
        dayCalc.setUTCDate(dayCalc.getUTCDate() + 1);
    }

    const yJD = dayCalc.getUTCFullYear() + 4800 - Math.floor((14 - (dayCalc.getUTCMonth() + 1)) / 12);
    const mJD = (dayCalc.getUTCMonth() + 1) + 12 * Math.floor((14 - (dayCalc.getUTCMonth() + 1)) / 12) - 3;
    const jd = dayCalc.getUTCDate() + Math.floor((153 * mJD + 2) / 5) + 365 * yJD + Math.floor(yJD / 4) - Math.floor(yJD / 100) + Math.floor(yJD / 400) - 32045;

    const canNgayIdx = (jd + 9) % 10;
    const chiNgayIdx = (jd + 1) % 12;

    let h = targetHour;
    const chiGioIdx = (h >= 23 || h < 1) ? 0 : Math.floor((h + 1) / 2) % 12;
    const canGioIdx = (((canNgayIdx % 5) * 2) + chiGioIdx) % 10;

    const diff = (chiNgayIdx - canNgayIdx + 12) % 12;
    const tk1 = CHI[(diff - 2 + 12) % 12];
    const tk2 = CHI[(diff - 1 + 12) % 12];

    // Ưu tiên sử dụng thư viện Lunar (độ chính xác thiên văn cao nhất theo chuẩn Tử Kim Sơn / VSOP87)
    if (typeof Solar !== 'undefined' && typeof Lunar !== 'undefined') {
        const msBeijing = actualDate.getTime() + 8 * 3600 * 1000 + 59 * 1000;
        const bDate = new Date(msBeijing);
        const solar = Solar.fromYmdHms(
            bDate.getUTCFullYear(),
            bDate.getUTCMonth() + 1,
            bDate.getUTCDate(),
            bDate.getUTCHours(),
            bDate.getUTCMinutes(),
            bDate.getUTCSeconds()
        );
        const lunar = solar.getLunar();

        const yGz = lunar.getYearInGanZhiExact();
        const canNam = GAN_MAP[yGz[0]] || yGz[0];
        const chiNam = ZHI_MAP[yGz[1]] || yGz[1];

        const mGz = lunar.getMonthInGanZhiExact();
        const canThang = GAN_MAP[mGz[0]] || mGz[0];
        const chiThang = ZHI_MAP[mGz[1]] || mGz[1];

        const prevJq = lunar.getPrevJieQi(false);
        const rawJqName = prevJq ? prevJq.getName() : '';
        const tietKhi = SOLAR_TERM_NAMES_VI[rawJqName] || rawJqName;

        return {
            nam: { can: canNam, chi: chiNam },
            thang: { can: canThang, chi: chiThang, hanh: NGU_HANH_CHI[chiThang] },
            ngay: { can: CAN[canNgayIdx], chi: CHI[chiNgayIdx], hanh: NGU_HANH_CHI[CHI[chiNgayIdx]] },
            gio: { can: CAN[canGioIdx], chi: CHI[chiGioIdx] },
            tuanKhong: [tk1, tk2],
            tietKhi: tietKhi
        };
    }

    // Thuật toán dự phòng Jean Meeus (đã tách mốc actualDate không bị nhảy ngày ở 23h)
    const actualYear = actualDate.getFullYear();
    const terms = getSolarTerm(actualYear);
    const termsPrev = getSolarTerm(actualYear - 1);
    const lapXuan = terms[2];

    let solarYear = actualDate < lapXuan ? actualYear - 1 : actualYear;
    let canNamIdx = (solarYear - 4) % 10;
    if (canNamIdx < 0) canNamIdx += 10;
    let chiNamIdx = (solarYear - 4) % 12;
    if (chiNamIdx < 0) chiNamIdx += 12;

    let chiThangIdx = 1;
    if (actualDate >= termsPrev[22] && actualDate < terms[0]) {
        chiThangIdx = 0;
    } else {
        const checkOrder = [22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0];
        const mapping = { 2: 2, 4: 3, 6: 4, 8: 5, 10: 6, 12: 7, 14: 8, 16: 9, 18: 10, 20: 11, 22: 0, 0: 1 };
        for (let tIdx of checkOrder) {
            if (actualDate >= terms[tIdx]) {
                chiThangIdx = mapping[tIdx];
                break;
            }
        }
    }

    const canThangIdx = ((canNamIdx * 2 + 2) + (chiThangIdx - 2 + 12)) % 10;
    const exactTermName = getExactSolarTermName(actualDate, actualYear, terms, termsPrev);

    return {
        nam: { can: CAN[canNamIdx], chi: CHI[chiNamIdx] },
        thang: { can: CAN[canThangIdx], chi: CHI[chiThangIdx], hanh: NGU_HANH_CHI[CHI[chiThangIdx]] },
        ngay: { can: CAN[canNgayIdx], chi: CHI[chiNgayIdx], hanh: NGU_HANH_CHI[CHI[chiNgayIdx]] },
        gio: { can: CAN[canGioIdx], chi: CHI[chiGioIdx] },
        tuanKhong: [tk1, tk2],
        tietKhi: exactTermName
    };
}

// ============================================
// APP STATE & UI
// ============================================

// Tab state removed, only coins is used.

function getChromeIntentUrl() {
    const url = window.location.href.replace(/#.*$/, '');
    const cleanUrl = url.replace(/^https?:\/\//, '');
    return `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
}

function closeInAppBanner() {
    const banner = document.getElementById('inapp-browser-banner');
    if (banner) banner.style.display = 'none';
}

function checkAutoOpenExternalBrowser() {
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isInApp = /FBAN|FBAV|FB_IAB|Zalo|ZaloTheme|Line|MicroMessenger|Snapchat|TikTok/i.test(ua);

    if (isAndroid && isInApp) {
        const banner = document.getElementById('inapp-browser-banner');
        if (banner) banner.style.display = 'flex';

        const btn = document.getElementById('btnOpenExternalBrowser');
        const intentUrl = getChromeIntentUrl();
        if (btn) {
            btn.href = intentUrl;
            btn.onclick = function(e) {
                window.location.href = intentUrl;
            };
        }

        // Tự động mở Chrome lần đầu khi người dùng bấm vào link chia sẻ trên FB/Zalo
        if (!sessionStorage.getItem('opened_chrome_intent')) {
            sessionStorage.setItem('opened_chrome_intent', 'true');
            setTimeout(() => {
                window.location.href = intentUrl;
            }, 350);
        }
    }
}

function init() {
    checkAutoOpenExternalBrowser();
    // Load Vietnamese Calligraphy Font dynamically
    if (!document.getElementById('charm-font-link')) {
        const link = document.createElement('link');
        link.id = 'charm-font-link';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap';
        document.head.appendChild(link);
    }

    const container = document.getElementById('linesContainer');
    for (let i = 6; i >= 1; i--) {
        const div = document.createElement('div');
        div.className = 'line-row';
        div.innerHTML = `
            <div class="line-label">Hào ${i}</div>
            <select id="line-${i}" class="line-select">
                <option value="yang">─── Dương</option>
                <option value="yin">─ ─ Âm</option>
            </select>
            <label class="line-moving-label">
                <input type="checkbox" id="moving-${i}" class="line-moving-checkbox">
                <span class="moving-text">Động</span>
            </label>
        `;
        container.appendChild(div);
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('inputDate').value = now.toISOString().slice(0, 16);

    const tzEl = document.getElementById('inputTimezone');
    if (tzEl) {
        autoDetectTimezone(tzEl);
    }
}

function autoDetectTimezone(selectEl) {
    if (!selectEl) return;
    try {
        const offsetMin = -new Date().getTimezoneOffset();
        const sign = offsetMin >= 0 ? '+' : '-';
        const absMin = Math.abs(offsetMin);
        const hours = String(Math.floor(absMin / 60)).padStart(2, '0');
        const mins = String(absMin % 60).padStart(2, '0');
        const tzString = `${sign}${hours}:${mins}`;

        let found = false;
        for (let i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].value === tzString) {
                selectEl.selectedIndex = i;
                found = true;
                break;
            }
        }

        if (!found) {
            const opt = document.createElement('option');
            opt.value = tzString;
            opt.textContent = `Vị trí hiện tại (${tzString})`;
            selectEl.insertBefore(opt, selectEl.firstChild);
            selectEl.selectedIndex = 0;
        }
    } catch (e) {
        console.warn('Auto-detect timezone error:', e);
    }
}

// switchTab function removed
function tossCoins() {
    for (let i = 1; i <= 6; i++) {
        const r = Math.random();
        // Original probability: 0=12.5%, 1=37.5%, 2=37.5%, 3=12.5%
        // 0 = Lão Âm (Âm + Động), 1 = Thiếu Dương (Dương + Tĩnh)
        // 2 = Thiếu Âm (Âm + Tĩnh), 3 = Lão Dương (Dương + Động)
        let isYang, isMoving;
        if (r < 0.125) {
            // Lão Âm
            isYang = false;
            isMoving = true;
        } else if (r < 0.5) {
            // Thiếu Dương
            isYang = true;
            isMoving = false;
        } else if (r < 0.875) {
            // Thiếu Âm
            isYang = false;
            isMoving = false;
        } else {
            // Lão Dương
            isYang = true;
            isMoving = true;
        }

        document.getElementById(`line-${i}`).value = isYang ? 'yang' : 'yin';
        document.getElementById(`moving-${i}`).checked = isMoving;
    }
}

function cleanSerialInput(el) {
    el.value = el.value.replace(/[^0-9]/g, '');
}

function getTimezoneDisplayTag(tzEl) {
    if (!tzEl) {
        if (typeof document !== 'undefined') {
            tzEl = document.getElementById('inputTimezone');
        }
    }
    if (!tzEl) return '';

    const selectedOpt = tzEl.selectedOptions ? tzEl.selectedOptions[0] : (tzEl.selectedIndex >= 0 ? tzEl.options[tzEl.selectedIndex] : null);
    if (!selectedOpt) return '';

    const val = (selectedOpt.value || tzEl.value || '').trim();
    const rawText = (selectedOpt.textContent || selectedOpt.text || '').trim();

    // Mặc định ở VN (+07:00 hoặc nhãn bắt đầu bằng "VN") -> không hiển thị gì cả
    if (val === '+07:00' || rawText.startsWith('VN')) {
        return '';
    }

    // Với khu vực khác: loại bỏ ngoặc đơn lồng bên trong nếu có rồi bọc ngoặc ngoài
    let clean = rawText.replace(/\(([^)]+)\)/g, '$1').replace(/\s+/g, ' ').trim();
    return clean ? ` (${clean})` : '';
}

function formatDate(isoStr) {
    if (!isoStr) return "";
    let input = isoStr;
    if (typeof input === 'string' && !input.includes('Z') && !input.includes('+') && !input.match(/-\d{2}:\d{2}$/)) {
        const tzEl = typeof document !== 'undefined' ? document.getElementById('inputTimezone') : null;
        input = input + (tzEl ? tzEl.value : (window.customTimezone || '+07:00'));
    }
    const { targetYear, targetMonth, targetDay, targetHour, targetMinute } = parseDatePartsWithTimezone(input);
    const p = n => n < 10 ? '0' + n : n;
    return `${p(targetDay)}/${p(targetMonth)}/${targetYear} - ${p(targetHour)}:${p(targetMinute)}`;
}

// ============================================
// DIVINATION PROCESSING
// ============================================

function processDivination() {
    // Original Luc Hao Logic ONLY
    // No Tu Vi check here

    const dVal = document.getElementById('inputDate').value;
    if (!dVal) {
        showToast("Vui lòng chọn ngày giờ gieo quẻ!");
        return;
    }
    const tzEl = document.getElementById('inputTimezone');
    const fullDateInput = (tzEl && tzEl.value) ? `${dVal}:00${tzEl.value}` : dVal;

    const calendar = calculateCanChi(fullDateInput);
    const tzTag = getTimezoneDisplayTag(tzEl);
    const formattedDate = formatDate(fullDateInput) + tzTag;

    let lines = [];
    let methodText = "";

    currentTabType = 'default';

    for (let i = 1; i <= 6; i++) {
        const lineType = document.getElementById(`line-${i}`).value;
        const isMoving = document.getElementById(`moving-${i}`).checked;
        const isYang = (lineType === 'yang');

        // Convert to original values: 0=Lão Âm, 1=Thiếu Dương, 2=Thiếu Âm, 3=Lão Dương
        let v;
        if (isYang && isMoving) v = 3;      // Lão Dương (Động)
        else if (isYang && !isMoving) v = 1; // Thiếu Dương (Tĩnh)
        else if (!isYang && isMoving) v = 0; // Lão Âm (Động)
        else v = 2;                          // Thiếu Âm (Tĩnh)

        lines.push(v);
    }
    methodText = "Lục hào";

    // Calculate hexagram data
    const isMaiHoa = false;
    currentHexData = calculateHexagramData(lines, calendar, methodText, formattedDate, isMaiHoa);

    // Show loading
    document.getElementById('loading-overlay').classList.add('visible');

    // Render HTML for capture
    renderCaptureHTML(currentHexData);

    // Capture image after a short delay to ensure rendering
    // Capture image after a short delay to ensure rendering
    setTimeout(() => {
        captureAndDisplayImage();
    }, 100);
}




function getBit(val, changed) {
    if (!changed) {
        return (val === 1 || val === 3) ? '1' : '0';
    }
    return (val === 0 || val === 1) ? '1' : '0';
}

function getRelation(el, palaceEl) {
    const els = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'];
    const pI = els.indexOf(palaceEl);
    const lI = els.indexOf(el);

    if (pI === lI) return "Huynh Đệ";
    if ((pI + 1) % 5 === lI) return "Tử Tôn";
    if ((lI + 1) % 5 === pI) return "Phụ Mẫu";
    if ((pI + 2) % 5 === lI) return "Thê Tài";
    if ((lI + 2) % 5 === pI) return "Quan Quỷ";
    return "";
}

function getLifeStage(el, baseChi) {
    const start = LS_START[el];
    const current = CHI.indexOf(baseChi);
    const diff = (current - start + 12) % 12;
    return LIFE_STAGES[diff];
}

function renderHexVisual(lines, isChanged) {
    const bits = lines.map(v => getBit(v, isChanged));
    let html = '';

    for (let i = 5; i >= 0; i--) {
        const isMoving = (lines[i] === 0 || lines[i] === 3);
        const moveClass = isMoving ? 'moving' : '';
        html += `<div class="gua-line ${bits[i] === '1' ? 'yang' : 'yin'} ${moveClass}"></div>`;
    }

    return `<div class="gua-container">${html}</div>`;
}

function renderCaptureHTML(data) {
    const {
        mainName, changedName, palaceName, info,
        mainAttr, changedPalaceName, changedAttr,
        linesData, shensha, dateInfo, methodText, lines, formattedDate, palaceEl
    } = data;

    // Construct HTML using the prepared data
    let rowsHtml = '';

    // Lines are stored 0-5 (Hào 1-6), display 6-1
    for (let i = 5; i >= 0; i--) {
        const line = linesData[i];
        const rowClass = line.isMoving ? 'row-moving' : 'row-static';

        let sym = (line.val === 1) ? '—' : (line.val === 2) ? '--' : (line.val === 3) ? 'O' : 'X';

        let sy = '';
        if (line.isShi) sy = `<span class="marker-the">Thế</span>`;
        if (line.isYing) sy = `<span class="marker-ung">Ứng</span>`;

        let phucHtml = '-';
        if (line.phucThan) {
            phucHtml = `<span class="phuc-than">${line.phucThan.rel} - ${line.phucThan.branch}</span>`;
        }

        const isTK = line.isTK ? 'K' : '-';
        const isCTK = line.isCTK ? 'K' : '-';

        // Changed part (Quẻ Biến)
        let cRel = line.changed ? line.changed.relation : getRelation(line.hanh, data.palaceEl); // Default to main if not moving/changed logic handled in calc
        // Actually, for static lines, the relation is same as main if we consider it doesn't change. 
        // But in the original code: 
        // const cTriName = (i <= 3) ? QUAI_SO[cInIdx].name : QUAI_SO[cOutIdx].name;
        // const cBranch = NAP_GIAP[cTriName][idx];
        // const cEl = NGU_HANH_CHI[cBranch];
        // const cRel = getRelation(cEl, palaceEl);
        // This logic runs for ALL lines in original code.
        // In my calc function I should preserve this.

        rowsHtml += `
        <tr class="${rowClass}">
            <td>${sym}</td>
            <td>${sy}</td>
            <td>${line.relation}</td>
            <td>${line.chi}-${line.hanh}</td>
            <td>${phucHtml}</td>
            <td>${isTK}</td>
            <td class="sep-col">${line.changed.relation}</td>
            <td>${line.changed.branch}-${line.changed.hanh}</td>
            <td>${line.lucThu}</td>
            <td>${isCTK}</td>
            <td>${line.tsNgay}</td>
            <td>${line.tsThang}</td>
        </tr>`;
    }

    // Render to hidden capture target
    const target = document.getElementById('captureTarget');
    target.innerHTML = `
        <div class="info-header">
            <div class="info-content">
                <div class="info-line"><strong>Ngày giờ:</strong> ${data.formattedDate} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Phương pháp:</strong> ${methodText}</div>
                <div class="info-line"><strong>Can chi:</strong> ${dateInfo.fullCanChi}</div>
                <div class="info-line"><strong>Hào tâm:</strong> ${dateInfo.haoTamText || ''} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Tuần Không:</strong> <span class="highlight">${dateInfo.tuanKhong}</span></div>
                <div class="info-line"><strong>Nhật Thần:</strong> <span class="highlight">${dateInfo.nhatThan}</span> &nbsp;&nbsp;&nbsp;&nbsp; <strong>Nguyệt Lệnh:</strong> <span class="highlight">${dateInfo.nguyetLenh}</span></div>
            </div>

        </div>
        
        <div class="hex-visual-section">
            <div class="hex-box">
                <div class="hex-title">${mainName}</div>
                ${renderHexVisual(data.lines, false)}
                <div class="hex-family">Họ ${palaceName}${mainAttr ? ' - ' + mainAttr : ''}</div>
            </div>
            ${data.hoData ? `
            <div class="hex-box hex-box-ho">
                <div class="hex-title">${data.hoData.name}</div>
                ${renderHexVisual(data.hoData.lines, false)}
                <div class="hex-family">Họ ${data.hoData.palaceName}${data.hoData.attr ? ' - ' + data.hoData.attr : ''}</div>
                ${data.ngamResult.length > 0 ? `<div class="hex-ngam-inline">${data.ngamResult.join(', ')}</div>` : ''}
            </div>` : `
            <div class="hex-ngam-indicator">${data.ngamResult.length > 0 ? data.ngamResult.map(t => `<span>${t}</span>`).join('') : ''}</div>
            `}
            <div class="hex-box">
                <div class="hex-title">${changedName}</div>
                ${renderHexVisual(data.lines, true)}
                <div class="hex-family">Họ ${changedPalaceName}${changedAttr ? ' - ' + changedAttr : ''}</div>
            </div>
        </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Hào</th>
                    <th>T/Ư</th>
                    <th>Lục Thân</th>
                    <th>Can Chi</th>
                    <th>P.Thần</th>
                    <th>TK</th>
                    <th class="sep-col">Lục Thân</th>
                    <th>Can Chi</th>
                    <th>Lục Thú</th>
                    <th>TK</th>
                    <th>TS Ngày</th>
                    <th>TS Tháng</th>
                </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
        </table>
        
        <div class="shensha-section">
            <div class="shensha-title">Thần Sát</div>
            <div class="shensha-grid">
                ${(() => {
                    const movingBranches = data.linesData.filter(l => l.isMoving).flatMap(l => [l.chi, l.changed.branch]);
                    let itemsHtml = shensha.map(s => {
                        let parts = s.split('</strong> ');
                        if (parts.length > 1) {
                            let values = parts[1];
                            let hasMoving = false;
                            movingBranches.forEach(b => {
                                if (values.includes(b)) hasMoving = true;
                                values = values.split(b).join(`<span style="color: red; font-weight: bold;">${b}</span>`);
                            });
                            let title = parts[0];
                            if (hasMoving) {
                                title = title.replace('<strong>', '<strong style="color: red;">');
                            }
                            return `<div class="ss-item">${title}</strong> ${values}</div>`;
                        }
                        return `<div class="ss-item">${s}</div>`;
                    }).join('');
                    
                    itemsHtml += `<div class="ss-item" style="grid-column: 3 / span 2; text-align: right; font-style: italic; color: #666; align-self: center;">Link gieo quẻ: gieoque.id.vn</div>`;
                    return itemsHtml;
                })()}
            </div>
        </div>
    `;
}



// ============================================
// NATIVE CANVAS 2D RENDERER (Chuẩn Nét Cao, Giữ Nguyên Màu Sắc Gốc #fefee5)
// ============================================

function drawRoundRect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function enableInkText(ctx, ratio = 0.22) {
    if (!ctx || ctx.__inkEnabled) return;
    ctx.__inkEnabled = true;
    const originalFillText = ctx.fillText.bind(ctx);
    ctx.fillText = function (text, x, y, maxWidth) {
        const font = this.font || '';
        const pxMatch = font.match(/([\d.]+)px/);
        const px = pxMatch ? parseFloat(pxMatch[1]) : 18;
        const isBold = /bold|700|800|900/i.test(font);
        const stem = isBold ? 0.12 : 0.08;
        const w = px * stem * ratio;
        if (w > 0 && typeof this.fillStyle === 'string') {
            this.save();
            this.lineJoin = 'round';
            this.miterLimit = 2;
            this.lineWidth = w;
            this.strokeStyle = this.fillStyle;
            if (maxWidth !== undefined) this.strokeText(text, x, y, maxWidth);
            else this.strokeText(text, x, y);
            this.restore();
        }
        if (maxWidth !== undefined) originalFillText(text, x, y, maxWidth);
        else originalFillText(text, x, y);
    };
}

function drawTextSpans(ctx, spans, startX, y) {
    let curX = startX;
    for (const span of spans) {
        ctx.font = span.font || '17px Inter, sans-serif';
        ctx.fillStyle = span.color || '#000000';
        ctx.fillText(span.text, curX, y);
        curX += ctx.measureText(span.text).width;
    }
    return curX;
}

async function renderHexagramToCanvas(data) {
    if (document.fonts) {
        await Promise.all([
            document.fonts.load('400 16px Inter'),
            document.fonts.load('400 17px Inter'),
            document.fonts.load('600 17px Inter'),
            document.fonts.load('700 16px Inter'),
            document.fonts.load('700 17px Inter'),
            document.fonts.load('700 19px Inter')
        ]).catch(() => []);
        await document.fonts.ready;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const W = 1040;
    const SCALE = 1.5; // Kích thước xuất ra = 1560px (chuẩn tối ưu < 2000px, không bị bóp mờ)

    const shenshaList = data.shensha || [];
    const shenshaRows = Math.ceil(shenshaList.length / 4);
    const itemH = 30;
    const shenshaGridH = shenshaRows * (itemH + 8);
    // Tính tổng chiều cao canvas
    const totalH = 20 + 130 + 10 + 195 + 10 + 38 + 6 * 38 + 16 + 28 + 10 + shenshaGridH + 16 + 20;
    const H = Math.ceil(totalH);

    canvas.width = Math.round(W * SCALE);
    canvas.height = Math.round(H * SCALE);
    ctx.scale(SCALE, SCALE);

    // Kích hoạt kỹ thuật "Mực in" (sheet-ink) làm dày nét chữ 22%
    enableInkText(ctx, 0.22);

    // 1. Nền màu vàng kem nguyên bản #fefee5
    ctx.fillStyle = '#fefee5';
    ctx.fillRect(0, 0, W, H);

    // 2. Khung viền ngoài tinh tế bảo vệ bố cục
    ctx.save();
    ctx.strokeStyle = '#d0c8b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, W - 16, H - 16);
    ctx.restore();

    // 3. Khối Thông Tin Header (4 dòng nguyên bản)
    const startX = 20;
    const dateInfo = data.dateInfo || {};

    // Dòng 1: Ngày giờ & Phương pháp
    drawTextSpans(ctx, [
        { text: 'Ngày giờ: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' },
        { text: (data.formattedDate || '') + '        ', font: '17px Inter, sans-serif', color: '#000000' },
        { text: 'Phương pháp: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' },
        { text: data.methodText || 'Lục hào', font: 'bold 17px Inter, sans-serif', color: '#000000' }
    ], startX, 36);

    // Dòng 2: Can chi
    drawTextSpans(ctx, [
        { text: 'Can chi: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' },
        { text: dateInfo.fullCanChi || '', font: '17px Inter, sans-serif', color: '#000000' }
    ], startX, 64);

    // Dòng 3: Hào tâm & Tuần Không
    const cleanHaoTam = (dateInfo.haoTamText || '').replace(/<[^>]*>/g, '').trim();
    const spansLine3 = [];
    if (cleanHaoTam) {
        spansLine3.push({ text: 'Hào tâm: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' });
        spansLine3.push({ text: cleanHaoTam + '        ', font: 'bold 17px Inter, sans-serif', color: '#e60000' });
    }
    spansLine3.push({ text: 'Tuần Không: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' });
    spansLine3.push({ text: dateInfo.tuanKhong || '', font: 'bold 17px Inter, sans-serif', color: '#e60000' });
    drawTextSpans(ctx, spansLine3, startX, 92);

    // Dòng 4: Nhật Thần & Nguyệt Lệnh
    drawTextSpans(ctx, [
        { text: 'Nhật Thần: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' },
        { text: (dateInfo.nhatThan || '') + '        ', font: 'bold 17px Inter, sans-serif', color: '#e60000' },
        { text: 'Nguyệt Lệnh: ', font: 'bold 17px Inter, sans-serif', color: '#1a1a1a' },
        { text: dateInfo.nguyetLenh || '', font: 'bold 17px Inter, sans-serif', color: '#e60000' }
    ], startX, 120);

    // Đường kẻ phân cách Header
    const yDiv1 = 138;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, yDiv1);
    ctx.lineTo(W - 20, yDiv1);
    ctx.stroke();

    // 4. Khu Vực Hình Quẻ (Hex Visual Section)
    const cX1 = 280, cX2 = 760;
    ctx.textAlign = 'center';
    ctx.font = 'bold 19px Inter, sans-serif';
    ctx.fillStyle = '#c41e3a';
    ctx.fillText((data.mainName || '').toUpperCase(), cX1, 168);
    ctx.fillText((data.changedName || '').toUpperCase(), cX2, 168);

    // Chỉ báo Phục Ngâm / Phản Ngâm ở giữa
    if (data.ngamResult && data.ngamResult.length > 0) {
        ctx.font = 'bold 17px Inter, sans-serif';
        ctx.fillStyle = '#000000';
        const startNgamY = 250 - ((data.ngamResult.length - 1) * 24) / 2;
        data.ngamResult.forEach((txt, idx) => {
            ctx.fillText(txt.toUpperCase(), W / 2, startNgamY + idx * 24);
        });
    }

    // Vẽ vạch Hào (từ Hào 6 xuống Hào 1)
    const yGuaStart = 188;
    const bitsMain = data.lines.map(v => getBit(v, false));
    const bitsChanged = data.lines.map(v => getBit(v, true));

    for (let i = 5; i >= 0; i--) {
        const lineIdx = 5 - i;
        const lineY = yGuaStart + lineIdx * 24;
        const isMoving = data.lines[i] === 0 || data.lines[i] === 3;
        const color = isMoving ? '#e60000' : '#1a1a1a';
        ctx.fillStyle = color;

        // Quẻ Chính
        const isYangMain = bitsMain[i] === '1';
        if (isYangMain) {
            ctx.fillRect(cX1 - 55, lineY, 110, 16);
        } else {
            // Âm: tách 2 vạch rộng 46px, khe giữa 18px
            ctx.fillRect(cX1 - 55, lineY, 46, 16);
            ctx.fillRect(cX1 - 55 + 46 + 18, lineY, 46, 16);
        }

        // Quẻ Biến
        const isYangChanged = bitsChanged[i] === '1';
        if (isYangChanged) {
            ctx.fillRect(cX2 - 55, lineY, 110, 16);
        } else {
            ctx.fillRect(cX2 - 55, lineY, 46, 16);
            ctx.fillRect(cX2 - 55 + 46 + 18, lineY, 46, 16);
        }
    }

    // Họ Quẻ bên dưới
    const yFam = yGuaStart + 6 * 24 + 14;
    ctx.font = '600 17px Inter, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(`HỌ ${(data.palaceName || '').toUpperCase()}${data.mainAttr ? ' - ' + data.mainAttr.toUpperCase() : ''}`, cX1, yFam);
    ctx.fillText(`HỌ ${(data.changedPalaceName || '').toUpperCase()}${data.changedAttr ? ' - ' + data.changedAttr.toUpperCase() : ''}`, cX2, yFam);

    // Đường kẻ phân cách Visual Section
    const yDiv2 = yFam + 22;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, yDiv2);
    ctx.lineTo(W - 20, yDiv2);
    ctx.stroke();

    // 5. Bảng Dữ Liệu 12 Cột (Đúng 100% kích thước, không bao giờ bị cắt mất cột)
    const colWidths = [50, 60, 100, 100, 100, 45, 100, 100, 110, 45, 95, 95];
    const colLefts = [];
    let curColX = 20;
    for (let w of colWidths) {
        colLefts.push(curColX);
        curColX += w;
    }
    const sepColX = colLefts[6]; // Cột 6 là vách ngăn cách Quẻ Biến

    // Tiêu đề bảng (Nền màu be #e2e2cc)
    const tableTop = yDiv2 + 12;
    ctx.fillStyle = '#e2e2cc';
    ctx.fillRect(20, tableTop, 1000, 38);

    ctx.strokeStyle = '#bbbbbb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, tableTop);
    ctx.lineTo(W - 20, tableTop);
    ctx.moveTo(20, tableTop + 38);
    ctx.lineTo(W - 20, tableTop + 38);
    ctx.moveTo(sepColX, tableTop);
    ctx.lineTo(sepColX, tableTop + 38);
    ctx.stroke();

    const headers = ['HÀO', 'T/Ư', 'LỤC THÂN', 'CAN CHI', 'P.THẦN', 'TK', 'LỤC THÂN', 'CAN CHI', 'LỤC THÚ', 'TK', 'TS NGÀY', 'TS THÁNG'];
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'center';
    headers.forEach((h, idx) => {
        const centerX = colLefts[idx] + colWidths[idx] / 2;
        ctx.fillText(h, centerX, tableTop + 25);
    });

    // Các hàng dữ liệu bảng (Hào 6 xuống 1)
    const rowH = 38;
    const rowStartY = tableTop + 38;
    for (let r = 0; r < 6; r++) {
        const i = 5 - r;
        const line = data.linesData[i];
        const rY = rowStartY + r * rowH;
        const centerY = rY + 25;

        // Viền dưới hàng
        ctx.strokeStyle = '#d0c8b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, rY + rowH);
        ctx.lineTo(W - 20, rY + rowH);
        ctx.stroke();

        // Đường dọc ngăn cách Quẻ Biến (sep-col)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.moveTo(sepColX, rY);
        ctx.lineTo(sepColX, rY + rowH);
        ctx.stroke();

        const isMoving = line.isMoving;
        const textColor = isMoving ? '#e60000' : '#000000';
        const font = isMoving ? 'bold 17px Inter, sans-serif' : '17px Inter, sans-serif';

        const sym = (line.val === 1) ? '—' : (line.val === 2) ? '--' : (line.val === 3) ? 'O' : 'X';
        const tu = line.isShi ? 'Thế' : line.isYing ? 'Ứng' : '';
        const phucThan = line.phucThan ? `${line.phucThan.rel} - ${line.phucThan.branch}` : '-';
        const tk = line.isTK ? 'K' : '-';
        const ctk = line.isCTK ? 'K' : '-';

        const vals = [
            sym,
            tu,
            line.relation,
            `${line.chi}-${line.hanh}`,
            phucThan,
            tk,
            line.changed.relation,
            `${line.changed.branch}-${line.changed.hanh}`,
            line.lucThu,
            ctk,
            line.tsNgay,
            line.tsThang
        ];

        vals.forEach((v, idx) => {
            const cX = colLefts[idx] + colWidths[idx] / 2;
            ctx.textAlign = 'center';
            if (idx === 1 && !isMoving && v) {
                ctx.font = 'bold 17px Inter, sans-serif';
                ctx.fillStyle = '#1a1a1a';
            } else if (idx === 4 && !isMoving) {
                ctx.font = '17px Inter, sans-serif';
                ctx.fillStyle = '#1a1a1a';
            } else {
                ctx.font = font;
                ctx.fillStyle = textColor;
            }
            ctx.fillText(v, cX, centerY);
        });
    }

    const tableBottom = rowStartY + 6 * rowH;

    // 6. Khu Vực Thần Sát (Shensha Section)
    const ssTop = tableBottom + 12;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, ssTop);
    ctx.lineTo(W - 20, ssTop);
    ctx.stroke();

    ctx.font = 'bold 17px Inter, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'left';
    ctx.fillText('THẦN SÁT', 20, ssTop + 24);

    const movingChiSet = new Set();
    data.linesData.forEach(line => {
        if (line.isMoving) {
            movingChiSet.add(line.chi);
            if (line.changed && line.changed.branch) movingChiSet.add(line.changed.branch);
        }
    });

    const gridStartY = ssTop + 36;
    const itW = (1000 - 3 * 12) / 4;
    shenshaList.forEach((s, idx) => {
        const c = idx % 4;
        const r = Math.floor(idx / 4);
        const itX = 20 + c * (itW + 12);
        const itY = gridStartY + r * (itemH + 8);

        // Gạch chân từng mục
        ctx.strokeStyle = '#d0c8b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(itX, itY + itemH);
        ctx.lineTo(itX + itW, itY + itemH);
        ctx.stroke();

        const m = s.match(/<strong>(.*?):<\/strong>\s*(.*)/);
        if (m) {
            const name = m[1] + ': ';
            const val = m[2] || '-';
            const chiVals = val.split(',').map(v => v.trim());
            const hasMovingChi = chiVals.some(ch => movingChiSet.has(ch));
            const color = hasMovingChi ? '#e60000' : '#1a1a1a';
            ctx.textAlign = 'left';
            drawTextSpans(ctx, [
                { text: name, font: 'bold 17px Inter, sans-serif', color: color },
                { text: val, font: hasMovingChi ? 'bold 17px Inter, sans-serif' : '17px Inter, sans-serif', color: color }
            ], itX, itY + 22);
        } else {
            ctx.textAlign = 'left';
            ctx.font = '17px Inter, sans-serif';
            ctx.fillStyle = '#111111';
            ctx.fillText(s, itX, itY + 22);
        }
    });

    // 7. Chân trang bên phải: Link gieo quẻ: gieoque.id.vn
    const footerY = gridStartY + (shenshaRows - 1) * (itemH + 8) + 22;
    ctx.font = 'italic 16px Inter, sans-serif';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'right';
    ctx.fillText('Link gieo quẻ: gieoque.id.vn', W - 20, footerY);

    return canvas;
}


async function captureAndDisplayImage() {
    try {
        if (!currentHexData) return;

        // Render trực tiếp bằng Canvas 2D Native Context
        const canvas = await renderHexagramToCanvas(currentHexData);

        // Chuyển đổi sang PNG Blob & Data URL chất lượng cao
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        currentImageBlob = blob;
        currentImageDataUrl = canvas.toDataURL('image/png');

        // Hiển thị ảnh quẻ sắc nét lên giao diện
        const imageDisplay = document.getElementById('imageDisplay');
        imageDisplay.innerHTML = '';

        const img = document.createElement('img');
        img.src = currentImageDataUrl;
        img.alt = 'Kết quả quẻ Lục Hào';
        imageDisplay.appendChild(img);

        // Ẩn loading overlay, hiện khu vực kết quả ngay lập tức
        document.getElementById('loading-overlay').classList.remove('visible');
        document.getElementById('resultSection').classList.add('visible');

        // Cuộn mượt đến nút tải ảnh
        setTimeout(() => {
            const btn = document.getElementById('downloadBtn');
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

    } catch (err) {
        console.error('Canvas render error:', err);
        document.getElementById('loading-overlay').classList.remove('visible');
        alert('Có lỗi khi tạo ảnh. Vui lòng thử lại!');
    }
}



function calculateHoData(mBits) {
    // Quẻ Hỗ: Nội lấy hào 2,3,4 (index 1,2,3). Ngoại lấy hào 3,4,5 (index 2,3,4)
    // mBits: [hào 1, hào 2, hào 3, hào 4, hào 5, hào 6] -> 1=Dương, 0=Âm
    const hoInBin = `${mBits[1]}${mBits[2]}${mBits[3]}`;
    const hoOutBin = `${mBits[2]}${mBits[3]}${mBits[4]}`;
    
    const hoInIdx = QUAI_SO.findIndex(q => q.bin === hoInBin);
    const hoOutIdx = QUAI_SO.findIndex(q => q.bin === hoOutBin);
    
    const hexID = (hoOutIdx << 3) | hoInIdx;
    const info = HEX_MAP[hexID] || { p: 0, shi: 1, type: '' };
    
    const name = TEN_QUE[hoOutIdx][hoInIdx];
    const palaceName = QUAI_SO[info.p].name;
    const attr = getHexAttribute(name, info.type);
    
    // Create lines array formatted like the main hexagram for renderHexVisual
    // val: 1 (Yang) or 2 (Yin). mBits are strings ('1'/'0'), so compare with '1'
    const lines = [
        mBits[1] === '1' ? 1 : 2, // hào 1 hỗ (hào 2 chính)
        mBits[2] === '1' ? 1 : 2, // hào 2 hỗ (hào 3 chính)
        mBits[3] === '1' ? 1 : 2, // hào 3 hỗ (hào 4 chính)
        mBits[2] === '1' ? 1 : 2, // hào 4 hỗ (hào 3 chính)
        mBits[3] === '1' ? 1 : 2, // hào 5 hỗ (hào 4 chính)
        mBits[4] === '1' ? 1 : 2  // hào 6 hỗ (hào 5 chính)
    ];

    return {
        name,
        palaceName,
        attr,
        lines
    };
}

function calculateHexagramData(lines, cal, methodText, formattedDate, isMaiHoa) {
    const mBits = lines.map(v => getBit(v, false));
    const mInBin = mBits.slice(0, 3).join('');
    const mOutBin = mBits.slice(3, 6).join('');
    const mInIdx = QUAI_SO.findIndex(q => q.bin === mInBin);
    const mOutIdx = QUAI_SO.findIndex(q => q.bin === mOutBin);

    const hexID = (mOutIdx << 3) | mInIdx;
    const info = HEX_MAP[hexID] || { p: 0, shi: 1 };
    const mainName = TEN_QUE[mOutIdx][mInIdx];
    const palaceName = QUAI_SO[info.p].name;
    const palaceEl = NGU_HANH_QUAI[palaceName];

    // Xác định thuộc tính Quẻ Chính
    const mainAttr = getHexAttribute(mainName, info.type);

    const cBits = lines.map(v => getBit(v, true));
    const cInIdx = QUAI_SO.findIndex(q => q.bin === cBits.slice(0, 3).join(''));
    const cOutIdx = QUAI_SO.findIndex(q => q.bin === cBits.slice(3, 6).join(''));

    const hexIDChanged = (cOutIdx << 3) | cInIdx;
    const infoChanged = HEX_MAP[hexIDChanged] || { p: 0, shi: 1, type: '' }; // Fallback info
    const changedName = TEN_QUE[cOutIdx][cInIdx];
    const changedPalaceName = QUAI_SO[infoChanged.p].name;
    const changedAttr = getHexAttribute(changedName, infoChanged.type);

    // Kiểm tra Phản Ngâm / Phục Ngâm
    const ngamResult = checkNgam(mInIdx, mOutIdx, cInIdx, cOutIdx);

    const lucThuList = LUC_THU[cal.ngay.can];

    const presentRelations = new Set();
    // First pass to find present relations
    for (let i = 0; i < 6; i++) {
        const mTriName = (i + 1 <= 3) ? QUAI_SO[mInIdx].name : QUAI_SO[mOutIdx].name;
        const mBranch = NAP_GIAP[mTriName][i];
        const mEl = NGU_HANH_CHI[mBranch];
        const mRel = getRelation(mEl, palaceEl);
        presentRelations.add(mRel);
    }

    const linesData = [];
    const movingLines = [];

    for (let i = 0; i < 6; i++) { // 0 to 5 (Hào 1-6)
        const lineVal = lines[i];
        const isMoving = (lineVal === 0 || lineVal === 3);
        const idx = i;

        // Main Hexagram Line
        const mTriName = (i + 1 <= 3) ? QUAI_SO[mInIdx].name : QUAI_SO[mOutIdx].name;
        const mBranch = NAP_GIAP[mTriName][i];
        const mEl = NGU_HANH_CHI[mBranch];
        const mRel = getRelation(mEl, palaceEl); // Relation to Palace defined by Main Hexagram

        const tsNgay = getLifeStage(mEl, cal.ngay.chi);
        const tsThang = getLifeStage(mEl, cal.thang.chi);

        const shi = info.shi;
        const ying = (shi + 3) > 6 ? shi - 3 : shi + 3;
        const isShi = (shi === i + 1);
        const isYing = (ying === i + 1);

        let phucThan = null;
        if (!presentRelations.has("Tử Tôn") || !presentRelations.has("Thê Tài") ||
            !presentRelations.has("Quan Quỷ") || !presentRelations.has("Phụ Mẫu") ||
            !presentRelations.has("Huynh Đệ")) {
            const pureTri = QUAI_SO[info.p].name;
            const pureBranch = NAP_GIAP[pureTri][i];
            const pureEl = NGU_HANH_CHI[pureBranch];
            const pureRel = getRelation(pureEl, palaceEl);
            if (!presentRelations.has(pureRel)) {
                phucThan = {
                    rel: pureRel.split(' ')[0],
                    branch: pureBranch
                };
            }
        }

        const isTK = cal.tuanKhong.includes(mBranch);

        // Changed Hexagram Line
        const cTriName = (i + 1 <= 3) ? QUAI_SO[cInIdx].name : QUAI_SO[cOutIdx].name;
        const cBranch = NAP_GIAP[cTriName][i];
        const cEl = NGU_HANH_CHI[cBranch];
        const cRel = getRelation(cEl, palaceEl);
        // Note: Relation of changed line is usually also compared to the Palace Element of the Main Hexagram in many systems.
        // The original code used `palaceEl` which was `NGU_HANH_QUAI[palaceName]` (Main Palace).
        // So `cRel` is correct as per original code.

        const isCTK = cal.tuanKhong.includes(cBranch);

        linesData.push({
            val: lineVal,
            isMoving,
            relation: mRel,
            chi: mBranch,
            hanh: mEl,
            phucThan,
            isTK,
            isShi,
            isYing,
            lucThu: lucThuList[i],
            tsNgay,
            tsThang,
            changed: {
                relation: cRel,
                branch: cBranch,
                hanh: cEl
            },
            isCTK
        });

        if (isMoving) {
            movingLines.push(i + 1);
        }
    }

    // --- LOGIC TÍNH HÀO TÂM NIỆM ---
    let haoTamObj = null;
    const shiIndex = linesData.findIndex(l => l.isShi);
    if (shiIndex !== -1) {
        const shiLine = linesData[shiIndex];
        
        const getTangHao = (idx) => {
            const pureTri = QUAI_SO[info.p].name;
            const pureBranch = NAP_GIAP[pureTri][idx];
            const pureEl = NGU_HANH_CHI[pureBranch];
            const pureRel = getRelation(pureEl, palaceEl);
            return { rel: pureRel, branch: pureBranch };
        };

        if (!shiLine.isMoving) {
            if (shiLine.changed.relation !== shiLine.relation) {
                haoTamObj = { rel: shiLine.changed.relation, branch: shiLine.changed.branch };
            }
        }

        if (!haoTamObj) {
            const tangHaoThe = getTangHao(shiIndex);
            if (tangHaoThe.rel !== shiLine.relation) {
                haoTamObj = tangHaoThe;
            } else {
                const hao5 = linesData[4];
                if (hao5 && !hao5.isMoving) {
                    if (hao5.relation !== shiLine.relation) {
                        haoTamObj = { rel: hao5.relation, branch: hao5.chi };
                    }
                } else if (hao5 && hao5.isMoving) {
                    const tangHao5 = getTangHao(4);
                    if (tangHao5.rel !== shiLine.relation) {
                        haoTamObj = tangHao5;
                    }
                }
            }
        }
    }

    let haoTamText = "";
    if (haoTamObj) {
        const relMap = {
            'Tử Tôn': 'Tử', 'Thê Tài': 'Tài', 'Quan Quỷ': 'Quan',
            'Huynh Đệ': 'Huynh', 'Phụ Mẫu': 'Phụ'
        };
        const relShort = relMap[haoTamObj.rel] || haoTamObj.rel;
        haoTamText = `<span class="highlight">${relShort} - ${haoTamObj.branch}</span>`;
    }

    const shensha = calculateShenSha(cal.ngay.can, cal.ngay.chi, cal.thang.chi);

    return {
        mainName,
        changedName,
        palaceName,
        palaceEl,
        mainAttr,
        changedPalaceName,
        changedAttr,
        info,
        lines,  // Raw lines array
        linesData,
        shensha,
        movingLines,
        ngamResult,
        hoData: isMaiHoa ? calculateHoData(mBits) : null,
        formattedDate,
        methodText,
        dateInfo: {
            fullCanChi: `Giờ ${cal.gio.can} ${cal.gio.chi}, Ngày ${cal.ngay.can} ${cal.ngay.chi}`,
            tietKhi: cal.tietKhi,
            haoTamText: haoTamText,
            tuanKhong: cal.tuanKhong.join(', '),
            nhatThan: `${cal.ngay.chi} - ${cal.ngay.hanh}`,
            nguyetLenh: `${cal.thang.chi} - ${cal.thang.hanh}`,
            nhatLenhShort: `${cal.ngay.can} ${cal.ngay.chi}`,
            nguyetLenhShort: `${cal.thang.can} ${cal.thang.chi}`,
            shenshaRaw: shensha
        }
    };
}

function generateCopyText(data) {
    const {
        mainName, changedName,
        linesData, movingLines,
        dateInfo, changedAttr, mainAttr
    } = data;

    let text = "";

    // 1. Intro (Removed as per user request)
    // text += "Mời chuyên gia Chu Thần Bân luận giải quẻ này theo đúng kỹ pháp của ngài. Luận giải kèm tượng thần sát mà tôi cung cấp\n\n";

    // 2. Nhat/Nguyet Lenh
    text += `- Nhật lệnh: ${dateInfo.nhatLenhShort}; Nguyệt lệnh: ${dateInfo.nguyetLenhShort}\n`;

    // 3. Than Sat
    // 3. Than Sat
    let ssText = "";
    if (Array.isArray(dateInfo.shenshaRaw)) {
        ssText = dateInfo.shenshaRaw.map(s => s.replace(/<[^>]*>/g, '')).filter(s => !s.endsWith('-')).join('; ');
    }
    text += `- Thần sát: [${ssText}]\n`;

    // 4. Tuan Khong
    text += `- Tuần không: ${dateInfo.tuanKhong}\n`;

    // 5. Ten Que - no instructional text
    // 5. Ten Que - no instructional text
    let queBienText = (movingLines.length > 0) ? changedName : "";
    if (movingLines.length > 0 && changedAttr) {
        queBienText += ` (${changedAttr})`;
    } else if (movingLines.length === 0) {
        queBienText = "Quẻ Tĩnh";
    }
    let dongHaoText = "";
    if (movingLines.length > 0) {
        dongHaoText = " [" + movingLines.map(h => `động hào ${h}`).join(', ') + "]";
    }
    text += `- Tên Quẻ Chủ: ${mainName} -> Tên Quẻ Biến: ${queBienText}${dongHaoText}\n`;

    // 6. Lines (6 to 1) - no header with instructional text
    for (let i = 5; i >= 0; i--) {
        const line = linesData[i];
        const lineNum = i + 1;

        // Build main hexagram part
        let mainPart = `${line.lucThu} - ${line.relation} ${line.chi} ${line.hanh}`;
        if (line.isShi) mainPart += " (Thế)";
        else if (line.isYing) mainPart += " (Ứng)";
        if (line.isTK) mainPart += " (Tuần Không)";

        // Build changed part if moving
        let changedPart = "";
        if (line.isMoving) {
            changedPart = ` -> Động Hóa ${line.changed.relation} ${line.changed.branch} ${line.changed.hanh}`;
            if (line.isCTK) changedPart += " (Tuần Không)";
        }

        // Build phuc than part if exists
        let phucPart = "";
        if (line.phucThan) {
            phucPart = ` (Phục thần: ${line.phucThan.rel} ${line.phucThan.branch})`;
        }

        text += `- Hào ${lineNum}: [${mainPart}]${changedPart}${phucPart};\n`;
    }

    return text;
}

function copyToClipboard() {
    if (!currentHexData) {
        alert("Vui lòng lập quẻ trước!");
        return;
    }

    const text = generateCopyText(currentHexData);
    copyTextToClipboard(text);
}

function copyTextToClipboard(text) {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast("Đã sao chép thành công!");
        }).catch(err => {
            console.error('Clipboard API failed, trying fallback: ', err);
            fallbackCopyText(text);
        });
    } else {
        // Fallback for older browsers and some mobile browsers
        fallbackCopyText(text);
    }
}

function fallbackCopyText(text) {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Ensure it's not visible but part of the DOM
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', ''); // Prevent keyboard on mobile

    document.body.appendChild(textArea);

    // iOS-specific selection
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        textArea.contentEditable = true;
        textArea.readOnly = false; // Must be false for selection to work
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
    } else {
        textArea.select();
    }

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast("Đã sao chép thành công!");
        } else {
            alert("Không thể sao chép. Vui lòng thử lại.");
        }
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        alert("Lỗi khi sao chép văn bản.");
    }

    document.body.removeChild(textArea);
}


function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.88)';
        toast.style.color = '#ffffff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '99999';
        toast.style.maxWidth = '90vw';
        toast.style.textAlign = 'center';
        toast.style.lineHeight = '1.45';
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-in-out';
        toast.style.pointerEvents = 'none';
        document.body.appendChild(toast);
    }

    toast.innerHTML = message;
    toast.style.opacity = '1';

    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 4500);
}

function tryBlobDownload(filename) {
    try {
        let blob = currentImageBlob;
        if (!blob && currentImageDataUrl) {
            const arr = currentImageDataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            blob = new Blob([u8arr], { type: mime });
        }
        if (!blob) return false;

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 2000);
        return true;
    } catch (e) {
        console.error('Blob download error:', e);
        return false;
    }
}

function highlightImageForLongPress() {
    const imgContainer = document.getElementById('imageDisplay');
    if (!imgContainer) return;
    imgContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const img = imgContainer.querySelector('img');
    if (img) {
        img.classList.remove('pulse-highlight');
        void img.offsetWidth; // force reflow
        img.classList.add('pulse-highlight');
        setTimeout(() => {
            img.classList.remove('pulse-highlight');
        }, 3000);
    }
}

function downloadImage() {
    if (!currentImageDataUrl && !currentImageBlob) {
        showToast('Chưa có ảnh để tải!');
        return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `que_luc_hao_${timestamp}.png`;
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isInApp = /FBAN|FBAV|FB_IAB|Zalo|ZaloTheme|Instagram|Line|MicroMessenger|Snapchat|Twitter|TikTok/i.test(ua);

    // 1. Thử Web Share API gốc nếu trình duyệt hỗ trợ chia sẻ tệp ảnh (gọi đồng bộ ngay trong click event)
    if (isMobile && navigator.share && navigator.canShare && currentImageBlob && window.File) {
        try {
            const file = new File([currentImageBlob], filename, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Quẻ Lục Hào'
                }).then(() => {
                    showToast('Đã mở bảng lưu ảnh!');
                }).catch(err => {
                    console.log('Share cancelled or not allowed:', err);
                    handleMobileDownloadFallback(isInApp, filename);
                });
                return;
            }
        } catch (e) {
            console.log('Web Share file check error:', e);
        }
    }

    handleMobileDownloadFallback(isInApp, filename);
}

function handleMobileDownloadFallback(isInApp, filename) {
    // 2. Thử tải tệp Blob qua thẻ <a download> (hoạt động tốt trên Android Chrome, Samsung Internet, Cốc Cốc, Safari, PC)
    const blobDownloaded = tryBlobDownload(filename);

    if (isInApp) {
        // Trong WebView Facebook / Zalo trên Android: Trình duyệt nội bộ chặn tải tệp tự động qua nút bấm
        // Ta cuộn tới ảnh, làm sáng ảnh và hướng dẫn người dùng chạm giữ vào ảnh (tính năng gốc lưu thẳng vào Bộ sưu tập 100%)
        highlightImageForLongPress();
        showToast('💡 <b>Trình duyệt Facebook / Zalo chặn tải tự động</b><br>👉 Bạn chỉ cần <b>chạm và giữ vào ảnh quẻ 1 giây</b> ➔ chọn <b>"Lưu hình ảnh"</b> để lưu vào máy nhé!');
    } else {
        if (blobDownloaded) {
            showToast('Đang tải ảnh về máy!<br><span style="font-size:12px;opacity:0.9;">Mở Thư viện ➔ chọn Album "Tải về" để xem ảnh nhé!</span>');
        } else {
            highlightImageForLongPress();
            showToast('💡 Vui lòng chạm giữ vào ảnh 1 giây ➔ chọn "Lưu hình ảnh" để lưu về máy!');
        }
    }
}

function calculateShenSha(dCan, dChi, mChi) {
    const list = [];

    const add = (name, val) => {
        let vStr = val || '';
        if (Array.isArray(val)) {
            vStr = val.join(', ');
        }
        if (!vStr) vStr = '-';
        list.push(`<strong>${name}:</strong> ${vStr}`);
    };

    const quy = {
        'Giáp': ['Sửu', 'Mùi'], 'Mậu': ['Sửu', 'Mùi'],
        'Ất': ['Tý', 'Thân'], 'Kỷ': ['Tý', 'Thân'],
        'Bính': ['Hợi', 'Dậu'], 'Đinh': ['Hợi', 'Dậu'],
        'Nhâm': ['Mão', 'Tỵ'], 'Quý': ['Mão', 'Tỵ'],
        'Canh': ['Sửu', 'Mùi'], 'Tân': ['Ngọ', 'Dần']
    };
    add('Quý Nhân', quy[dCan]);

    const loc = { 'Giáp': 'Dần', 'Ất': 'Mão', 'Bính': 'Tỵ', 'Mậu': 'Tỵ', 'Đinh': 'Ngọ', 'Kỷ': 'Ngọ', 'Canh': 'Thân', 'Tân': 'Dậu', 'Nhâm': 'Hợi', 'Quý': 'Tý' };
    add('Lộc Thần', loc[dCan]);

    const kinh = { 'Giáp': 'Mão', 'Ất': 'Dần', 'Bính': 'Ngọ', 'Mậu': 'Ngọ', 'Đinh': 'Tỵ', 'Kỷ': 'Tỵ', 'Canh': 'Dậu', 'Tân': 'Thân', 'Nhâm': 'Tý', 'Quý': 'Hợi' };
    add('Dương Nhận', kinh[dCan]);

    const van = { 'Giáp': 'Tỵ', 'Ất': 'Ngọ', 'Bính': 'Thân', 'Mậu': 'Thân', 'Đinh': 'Dậu', 'Kỷ': 'Dậu', 'Canh': 'Hợi', 'Tân': 'Tý', 'Nhâm': 'Dần', 'Quý': 'Mão' };
    add('Văn Xương', van[dCan]);

    const triadMap = {
        'Thân': 'Thủy', 'Tý': 'Thủy', 'Thìn': 'Thủy',
        'Dần': 'Hỏa', 'Ngọ': 'Hỏa', 'Tuất': 'Hỏa',
        'Tỵ': 'Kim', 'Dậu': 'Kim', 'Sửu': 'Kim',
        'Hợi': 'Mộc', 'Mão': 'Mộc', 'Mùi': 'Mộc'
    };
    const group = triadMap[dChi];

    if (group) {
        const dm = { 'Thủy': 'Dần', 'Hỏa': 'Thân', 'Kim': 'Hợi', 'Mộc': 'Tỵ' };
        add('Dịch Mã', dm[group]);

        const dao = { 'Thủy': 'Dậu', 'Hỏa': 'Mão', 'Kim': 'Ngọ', 'Mộc': 'Tý' };
        add('Đào Hoa', dao[group]);

        const tuong = { 'Thủy': 'Tý', 'Hỏa': 'Ngọ', 'Kim': 'Dậu', 'Mộc': 'Mão' };
        add('Tướng Tinh', tuong[group]);

        const kiep = { 'Thủy': 'Tỵ', 'Hỏa': 'Hợi', 'Kim': 'Dần', 'Mộc': 'Thân' };
        add('Kiếp Sát', kiep[group]);

        const hoa = { 'Thủy': 'Thìn', 'Hỏa': 'Tuất', 'Kim': 'Sửu', 'Mộc': 'Mùi' };
        add('Hoa Cái', hoa[group]);

        const muu = { 'Thủy': 'Tuất', 'Kim': 'Mùi', 'Hỏa': 'Thìn', 'Mộc': 'Sửu' };
        add('Mưu Tinh', muu[group]);

        const tai = { 'Thủy': 'Ngọ', 'Hỏa': 'Tý', 'Kim': 'Mão', 'Mộc': 'Dậu' };
        add('Tai Sát', tai[group]);

        const vong = { 'Thủy': 'Hợi', 'Hỏa': 'Tỵ', 'Kim': 'Thân', 'Mộc': 'Dần' };
        add('Vong Thần', vong[group]);
    } else {
        for (let i = 0; i < 8; i++) add('', '');
    }

    const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    const mIdx = branches.indexOf(mChi);
    if (mIdx !== -1) {
        const ty = branches[(mIdx - 1 + 12) % 12];
        add('Thiên Y', ty);
    } else {
        add('Thiên Y', '-');
    }

    const muaMap = {
        'Dần': 'Tuất', 'Mão': 'Tuất', 'Thìn': 'Tuất',
        'Tỵ': 'Sửu', 'Ngọ': 'Sửu', 'Mùi': 'Sửu',
        'Thân': 'Thìn', 'Dậu': 'Thìn', 'Tuất': 'Thìn',
        'Hợi': 'Mùi', 'Tý': 'Mùi', 'Sửu': 'Mùi'
    };
    add('Thiên Hỉ', muaMap[mChi]);

    return list;
}

// ============================================
// COIN TOSS INTERACTIVE FEATURE
// ============================================

let tossResults = [];
let currentTossIndex = 1;

function startCoinToss() {
    // Reset State
    tossResults = [];
    currentTossIndex = 1;

    // Reset UI
    const modal = document.getElementById('coin-toss-modal');
    const resultsList = document.getElementById('toss-results-list');
    const tossBtn = document.getElementById('toss-btn');
    const finishBtn = document.getElementById('finish-toss-btn');
    const statusText = document.getElementById('toss-status');
    const coins = document.querySelectorAll('.coin');
    const progressFill = document.getElementById('toss-progress-fill');

    resultsList.innerHTML = '';
    tossBtn.style.display = 'block';
    tossBtn.disabled = false;
    tossBtn.innerHTML = 'Gieo Hào 1';
    finishBtn.style.display = 'none';
    statusText.innerText = 'Hào 1 / 6';
    if (progressFill) progressFill.style.width = '0%';

    // Reset Coins Rotation
    coins.forEach(coin => {
        coin.classList.remove('tossing');
        coin.style.transform = 'rotateY(0deg)';
        const front = coin.querySelector('.front');
        const back = coin.querySelector('.back');
        if (front) front.style.transform = 'rotateY(0deg)';
        if (back) back.style.transform = 'rotateY(180deg)';
    });

    // Show Modal
    modal.classList.add('active');
}

function closeCoinTossModal() {
    document.getElementById('coin-toss-modal').classList.remove('active');
}

function performToss() {
    if (currentTossIndex > 6) return;

    const tossBtn = document.getElementById('toss-btn');
    tossBtn.disabled = true;

    const coins = document.querySelectorAll('.coin');

    // Add animation class
    coins.forEach((coin, index) => {
        coin.classList.remove('tossing');
        // Force reflow
        void coin.offsetWidth;
        coin.classList.add('tossing');
    });

    // Generate Results (The Core Random Logic)
    // 3 Independent Coins: True = Yang (Front/Duong), False = Yin (Back/Am)
    const r1 = Math.random() < 0.5;
    const r2 = Math.random() < 0.5;
    const r3 = Math.random() < 0.5;

    const coinResults = [r1, r2, r3];
    const yangCount = coinResults.filter(r => r).length;

    // Calculate Line Result
    // 0 Yang -> Lão Âm (Line 0)
    // 1 Yang -> Thiếu Dương (Line 1)
    // 2 Yang -> Thiếu Âm (Line 2)
    // 3 Yang -> Lão Dương (Line 3)
    let lineValue, lineText, lineSymbol;
    let isMoving = false;
    let isYangLine = false;

    if (yangCount === 0) {
        lineValue = 0; // Lão Âm
        lineText = "Lão Âm (Âm động)";
        lineSymbol = "X";
        isMoving = true;
        isYangLine = false; // Âm
    } else if (yangCount === 1) {
        lineValue = 1; // Thiếu Dương
        lineText = "Thiếu Dương (Dương tĩnh)";
        lineSymbol = "—";
        isMoving = false;
        isYangLine = true; // Dương
    } else if (yangCount === 2) {
        lineValue = 2; // Thiếu Âm
        lineText = "Thiếu Âm (Âm tĩnh)";
        lineSymbol = "--";
        isMoving = false;
        isYangLine = false; // Âm
    } else {
        lineValue = 3; // Lão Dương
        lineText = "Lão Dương (Dương động)";
        lineSymbol = "O";
        isMoving = true;
        isYangLine = true; // Dương
    }

    tossResults.push({
        value: lineValue,
        isYang: isYangLine,
        isMoving: isMoving,
        yangCount: yangCount,
        coinDetails: coinResults
    });

    // Wait for animation to finish (2s matches new CSS animation)
    setTimeout(() => {
        // Stop Animation & Set Final State
        coins.forEach((coin, index) => {
            coin.classList.remove('tossing');

            // Animation ends at rotateY(3600deg) = 10 full spins
            const isYang = coinResults[index];
            const finalAngle = 3600 + (isYang ? 0 : 180);
            coin.style.transform = `rotateY(${finalAngle}deg)`;
        });

        // Update Results UI with visual hexagram line
        addResultToStack(currentTossIndex, lineText, lineSymbol, isMoving, isYangLine);

        // Update progress bar
        const progressFill = document.getElementById('toss-progress-fill');
        if (progressFill) progressFill.style.width = `${(currentTossIndex / 6) * 100}%`;

        // Prepare next step
        currentTossIndex++;

        if (currentTossIndex <= 6) {
            tossBtn.innerHTML = `Gieo Hào ${currentTossIndex}`;
            tossBtn.disabled = false;
            document.getElementById('toss-status').innerText = `Hào ${currentTossIndex} / 6`;
        } else {
            tossBtn.style.display = 'none';
            const finishBtn = document.getElementById('finish-toss-btn');
            if (finishBtn) finishBtn.style.display = 'none';
            document.getElementById('toss-status').innerText = 'Đã gieo xong 6 hào!';
            
            // Auto finish toss sequence after 6th toss
            finishTossSequence();
        }

    }, 2000);
}

function addResultToStack(index, text, symbol, isMoving, isYang) {
    const container = document.getElementById('toss-results-list');
    const row = document.createElement('div');
    row.className = `hex-line-result ${isMoving ? 'moving' : ''}`;

    const lineType = isYang ? 'yang-line' : 'yin-line';
    const movingClass = isMoving ? 'moving-line' : '';
    const descText = isMoving ? (isYang ? 'Dương Động' : 'Âm Động') : (isYang ? 'Dương Tĩnh' : 'Âm Tĩnh');

    row.innerHTML = `
        <span class="hex-num">${index}</span>
        <div class="hex-visual ${lineType} ${movingClass}"></div>
        <span class="hex-desc">${descText}</span>
    `;
    container.appendChild(row);
}

function finishTossSequence() {
    // Populate Main Form from toss results
    tossResults.forEach((res, idx) => {
        const lineNum = idx + 1;
        const select = document.getElementById(`line-${lineNum}`);
        const checkbox = document.getElementById(`moving-${lineNum}`);

        if (!select || !checkbox) return;

        select.value = res.isYang ? 'yang' : 'yin';
        checkbox.checked = res.isMoving;
    });

    closeCoinTossModal();

    // Auto-process divination immediately
    setTimeout(() => {
        processDivination();
    }, 100);
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', init);

// End of Divination functions
