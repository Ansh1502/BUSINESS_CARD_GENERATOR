let currentSector = 'tech';

const sectorData = {
    tech: {
        name: 'Technology',
        icon: 'fas fa-laptop-code',
        defaultTitle: 'Software Engineer',
        defaultCompany: 'Tech Solutions Inc.'
    },
    medical: {
        name: 'Healthcare',
        icon: 'fas fa-heartbeat',
        defaultTitle: 'Medical Doctor',
        defaultCompany: 'Health Medical Center'
    },
    finance: {
        name: 'Finance',
        icon: 'fas fa-chart-line',
        defaultTitle: 'Financial Advisor',
        defaultCompany: 'Finance Corp'
    },
    creative: {
        name: 'Creative',
        icon: 'fas fa-palette',
        defaultTitle: 'Creative Director',
        defaultCompany: 'Creative Studio'
    },
    legal: {
        name: 'Legal',
        icon: 'fas fa-balance-scale',
        defaultTitle: 'Attorney at Law',
        defaultCompany: 'Legal Associates'
    },
    education: {
        name: 'Education',
        icon: 'fas fa-graduation-cap',
        defaultTitle: 'Professor',
        defaultCompany: 'University College'
    }
};

// Sector selector buttons
document.querySelectorAll('.sector-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.sector-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentSector = this.dataset.sector;
        updateCardStyle();
        updateDefaults();
    });
});

// Live preview updates
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', updatePreview);
});

function updateCardStyle() {
    const card = document.getElementById('businessCard');
    const templateName = document.getElementById('templateName');
    const logoUpload = document.getElementById('logoUpload');
    const cardLogo = document.getElementById('cardLogo');

    card.className = `business-card card-${currentSector}`;
    templateName.textContent = sectorData[currentSector].name;

    // Restore default icon only if image is not uploaded
    if (!logoUpload.files[0]) {
        cardLogo.innerHTML = `<i class="${sectorData[currentSector].icon}"></i>`;
    }
    function setLogoBackgroundBySector() {
    const logoDiv = document.getElementById('cardLogo');
    const bgColors = {
        tech: '#6c63ff',
        medical: '#38ef7d',
        finance: '#3498db',
        creative: '#ff9f43',
        legal: '#2c3e50',
        education: '#27ae60'
    };
    logoDiv.style.backgroundColor = bgColors[currentSector];
}

}


function updateDefaults() {
    const sector = sectorData[currentSector];
    if (!document.getElementById('title').value) {
        document.getElementById('title').value = sector.defaultTitle;
    }
    if (!document.getElementById('company').value) {
        document.getElementById('company').value = sector.defaultCompany;
    }
    updatePreview();
}

function updatePreview() {
    const name = document.getElementById('name').value || 'John Doe';
    const title = document.getElementById('title').value || sectorData[currentSector].defaultTitle;
    const company = document.getElementById('company').value || sectorData[currentSector].defaultCompany;
    const email = document.getElementById('email').value || 'john.doe@example.com';
    const phone = document.getElementById('phone').value || '+1 (555) 123-4567';
    const website = document.getElementById('website').value || 'www.johndoe.com';

    document.getElementById('cardName').textContent = name;
    document.getElementById('cardTitle').textContent = title;
    document.getElementById('cardCompany').innerHTML = `<i class="fas fa-building"></i> ${company}`;
    document.getElementById('cardEmail').innerHTML = `<i class="fas fa-envelope"></i> ${email}`;
    document.getElementById('cardPhone').innerHTML = `<i class="fas fa-phone"></i> ${phone}`;
    document.getElementById('cardWebsite').innerHTML = `<i class="fas fa-globe"></i> ${website}`;
    document.getElementById('logoUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const cardLogo = document.getElementById('cardLogo');
    const logoInfo = document.getElementById('logoInfo');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            cardLogo.innerHTML = `<img src="${event.target.result}" alt="Logo">`;
            logoInfo.innerHTML = `📁 ${file.name} <button id="clearLogo" style="margin-left:10px; color:red; cursor:pointer;">Clear</button>`;
            document.getElementById('clearLogo').onclick = () => {
                e.target.value = '';
                logoInfo.innerHTML = '';
                cardLogo.innerHTML = `<i class="${sectorData[currentSector].icon}"></i>`;
            };
        };
        reader.readAsDataURL(file);
    } else {
        logoInfo.innerHTML = '';
        cardLogo.innerHTML = `<i class="${sectorData[currentSector].icon}"></i>`;
    }
});


}

function generateCard() {
    updatePreview();
    const card = document.getElementById('businessCard');
    card.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
        card.style.transform = 'rotateY(0deg)';
    }, 400);
}

function exportCard() {
    const card = document.getElementById('businessCard');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1050;
    canvas.height = 630;

    const gradientColors = {
        tech: ['#667eea', '#764ba2'],
        medical: ['#11998e', '#38ef7d'],
        finance: ['#2c3e50', '#3498db'],
        creative: ['#ff6b6b', '#feca57'],
        legal: ['#2c3e50', '#34495e'],
        education: ['#8360c3', '#2ebf91']
    };

    const colors = gradientColors[currentSector];
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 60);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Inter, Arial';
    ctx.fillText(document.getElementById('cardName').textContent, 90, 180);

    ctx.font = '48px Inter, Arial';
    ctx.fillText(document.getElementById('cardTitle').textContent, 90, 240);

    ctx.font = '36px Inter, Arial';
    const contactInfo = [
        document.getElementById('cardCompany').textContent,
        document.getElementById('cardEmail').textContent,
        document.getElementById('cardPhone').textContent,
        document.getElementById('cardWebsite').textContent
    ];

    contactInfo.forEach((info, index) => {
        ctx.fillText(info, 90, 340 + (index * 50));
    });

    const link = document.createElement('a');
    link.download = `business-card-${document.getElementById('name').value || 'professional'}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
}
function renderLogo(src) {
    const fit = document.getElementById('logoFit').value;
    document.getElementById('cardLogo').innerHTML =
        `<img src="${src}" style="width:100%; height:100%; object-fit:${fit}; border-radius:12px;">`;
}

document.getElementById('logoFit').addEventListener('change', () => {
    const logo = localStorage.getItem('logoImage');
    if (logo) renderLogo(logo);
});
document.getElementById('logoUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const logoData = event.target.result;
            localStorage.setItem('logoImage', logoData);
            renderLogo(logoData);
        };
        reader.readAsDataURL(file);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedLogo = localStorage.getItem('logoImage');
    if (savedLogo) renderLogo(savedLogo);
});
logoInfo.innerHTML = `📁 ${file.name} <button id="clearLogo" style="margin-left:10px; color:red; cursor:pointer;">Clear</button>`;
document.getElementById('clearLogo').onclick = () => {
    localStorage.removeItem('logoImage');
    document.getElementById('logoUpload').value = '';
    logoInfo.innerHTML = '';
    cardLogo.innerHTML = `<i class="${sectorData[currentSector].icon}"></i>`;
};


// Initialize default values on load
updateDefaults();
