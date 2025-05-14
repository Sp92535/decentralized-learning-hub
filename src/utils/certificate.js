import { createCanvas } from 'canvas';
import { getCertificateId, getCertificateURL } from './course_marketplace';
import { v4 as uuidv4 } from 'uuid';

export const generateCertificate = async (userData, course) => {
    // Create canvas with standard certificate dimensions (landscape orientation)
    const width = 3508; // A4 width in pixels at 300 DPI (landscape)
    const height = 2480; // A4 height in pixels at 300 DPI (landscape)

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#fdfbf5'; // Cream/off-white background
    ctx.fillRect(0, 0, width, height);

    // Add subtle background pattern
    ctx.fillStyle = '#f9f5e8';
    for (let i = 0; i < width; i += 80) {
        for (let j = 0; j < height; j += 80) {
            ctx.fillRect(i, j, 40, 40);
        }
    }

    // Add decorative border
    const borderInset = 80;

    // Draw decorative corners instead of full border
    const cornerSize = 150;
    ctx.strokeStyle = '#c9a651'; // Gold color
    ctx.lineWidth = 6;

    // Top left corner
    ctx.beginPath();
    ctx.moveTo(borderInset + cornerSize, borderInset);
    ctx.lineTo(borderInset, borderInset);
    ctx.lineTo(borderInset, borderInset + cornerSize);
    ctx.stroke();

    // Top right corner
    ctx.beginPath();
    ctx.moveTo(width - borderInset - cornerSize, borderInset);
    ctx.lineTo(width - borderInset, borderInset);
    ctx.lineTo(width - borderInset, borderInset + cornerSize);
    ctx.stroke();

    // Bottom left corner
    ctx.beginPath();
    ctx.moveTo(borderInset, height - borderInset - cornerSize);
    ctx.lineTo(borderInset, height - borderInset);
    ctx.lineTo(borderInset + cornerSize, height - borderInset);
    ctx.stroke();

    // Bottom right corner
    ctx.beginPath();
    ctx.moveTo(width - borderInset - cornerSize, height - borderInset);
    ctx.lineTo(width - borderInset, height - borderInset);
    ctx.lineTo(width - borderInset, height - borderInset - cornerSize);
    ctx.stroke();

    // Add ornamental header flourish
    const flourishWidth = 500;
    const flourishHeight = 80;
    const flourishX = (width - flourishWidth) / 2;
    const flourishY = height * 0.18;

    // Left side of flourish
    ctx.beginPath();
    ctx.moveTo(flourishX, flourishY);
    ctx.bezierCurveTo(
        flourishX + 100, flourishY - 40,
        flourishX + 200, flourishY + 40,
        flourishX + flourishWidth / 2 - 50, flourishY
    );
    ctx.strokeStyle = '#c9a651';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Right side of flourish
    ctx.beginPath();
    ctx.moveTo(flourishX + flourishWidth, flourishY);
    ctx.bezierCurveTo(
        flourishX + flourishWidth - 100, flourishY - 40,
        flourishX + flourishWidth - 200, flourishY + 40,
        flourishX + flourishWidth / 2 + 50, flourishY
    );
    ctx.stroke();

    // Add header text - INCREASED SIZE
    ctx.font = 'bold 120px "Times New Roman", serif'; // Increased from 100px
    ctx.fillStyle = '#2a2a60'; // Dark navy blue
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', width / 2, height * 0.25);

    // Add decorative line
    ctx.beginPath();
    ctx.moveTo(width / 2 - 600, height * 0.28);
    ctx.lineTo(width / 2 + 600, height * 0.28);
    ctx.strokeStyle = '#c9a651';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add "This certifies that" text - INCREASED SIZE
    ctx.font = 'italic 60px "Times New Roman", serif'; // Increased from 50px
    ctx.fillStyle = '#3a3a3a';
    ctx.fillText('This certifies that', width / 2, height * 0.38);

    // Draw Name - INCREASED SIZE
    ctx.font = 'bold 110px "Times New Roman", serif'; // Increased from 90px
    ctx.fillStyle = '#2a2a60';
    ctx.fillText(userData.name, width / 2, height * 0.46);

    // Draw decorative line under name
    ctx.beginPath();
    ctx.moveTo(width / 2 - 500, height * 0.48);
    ctx.lineTo(width / 2 + 500, height * 0.48);
    ctx.strokeStyle = '#c9a651';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add "has successfully completed" text - INCREASED SIZE
    ctx.font = 'italic 60px "Times New Roman", serif'; // Increased from 50px
    ctx.fillStyle = '#3a3a3a';
    ctx.fillText('has successfully completed', width / 2, height * 0.55);

    // Draw Course Name - INCREASED SIZE
    ctx.font = 'bold 90px "Times New Roman", serif'; // Increased from 70px
    ctx.fillStyle = '#2a2a60';
    ctx.fillText(course.name, width / 2, height * 0.62);

    // Add date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Add certificate seal/emblem
    const sealRadius = 140; // Slightly larger seal
    const sealX = width * 0.22;
    const sealY = height * 0.78;

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#b38728';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 15, 0, 2 * Math.PI);
    ctx.strokeStyle = '#b38728';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw star shape in the center
    ctx.fillStyle = '#b38728';
    const starPoints = 5;
    const outerRadius = sealRadius - 40;
    const innerRadius = outerRadius / 2;

    ctx.beginPath();
    for (let i = 0; i < starPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * i) / starPoints;
        const x = sealX + radius * Math.sin(angle);
        const y = sealY + radius * Math.cos(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();

    // Add text around the seal - INCREASED SIZE
    ctx.fillStyle = '#2a2a60';
    ctx.font = 'bold 30px Arial, sans-serif'; // Increased from 16px
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED • BLOCKCHAIN • CERTIFIED • AUTHENTIC •', sealX, sealY + sealRadius + 30);


    // Instructor info (assumed to be provided)
    const instructorName = course.instructor || "Instructor Name";
    const instructorAddress = course.instructorAddress || "Instructor Address";
    
    // Add signature area
    const signatureX = width * 0.78;
    const signatureY = height * 0.78;

    // Add instructor name and address just above the line
    ctx.font = '40px "Times New Roman", serif';
    ctx.fillStyle = '#3a3a3a';
    ctx.textAlign = 'center';
    ctx.fillText(instructorName, signatureX, signatureY - 60);
    ctx.fillText(instructorAddress, signatureX, signatureY - 10);

    // Draw line for signature
    ctx.beginPath();
    ctx.moveTo(signatureX - 250, signatureY);
    ctx.lineTo(signatureX + 250, signatureY);
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add signature label and date - INCREASED SIZE
    ctx.font = '50px "Times New Roman", serif'; // Increased from 40px
    ctx.fillStyle = '#3a3a3a';
    ctx.textAlign = 'center';
    ctx.fillText('Authorized Signature', signatureX, signatureY + 50);
    ctx.fillText(dateStr, signatureX, signatureY + 120);


    // Add certificate ID and blockchain verification information - INCREASED SIZE
    ctx.font = '40px Arial, sans-serif'; // Increased from 30px
    ctx.fillStyle = '#555555';

    const certificateId = uuidv4();

    // Certificate verification section
    const verificationY = height * 0.92;
    ctx.fillText(`Certificate ID: ${certificateId}`, width / 2, verificationY);

    // Truncate wallet address for display
    const shortAddress = userData.address.substring(0, 6) + '...' +
        userData.address.substring(userData.address.length - 4);
    ctx.fillText(`Wallet Address: ${shortAddress}`, width / 2, verificationY + 60); // Adjusted spacing

    const verificationUrl = `http://localhost:3000/certificate/${certificateId}`;
    ctx.fillStyle = 'blue'; // Blue to make it look like a link
    ctx.font = 'bold 30px Arial'; // Make it stand out
    ctx.fillText(`Verify at: ${verificationUrl}`, width / 2, verificationY + 120);

    return {
        buffer: canvas.toBuffer('image/png'),
        certificateId
    };

}

export const getCertificate = async (courseId) => {
    const certificateId = await getCertificateId(courseId);
    if (!certificateId) {
        return {
            success: false,
            message: "Certificate not found"
        }

    }
    console.log("Certificate ID XXX:", certificateId);

    const certificateURL = await getCertificateURL(certificateId);
    if (!certificateURL) {
        return {
            success: false,
            message: "Certificate URL not found"
        }
    }
    return {
        success: true,
        certificateURL
    }
}

export const getCertificateURLbyId = async (certificateId) => {

    const certificateURL = await getCertificateURL(certificateId);
    if (!certificateURL) {
        return {
            success: false,
            message: "Certificate URL not found"
        }
    }
    return {
        success: true,
        certificateURL
    }
}