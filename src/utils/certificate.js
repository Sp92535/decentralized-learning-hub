import { createCanvas, loadImage } from 'canvas';
import { getCertificateId, getCertificateURL } from './course_marketplace';

export const generateCertificate = async (name, course) => {
    const template = await loadImage('./public/certificate_template.png'); // Make sure this exists

    const width = template.width;
    const height = template.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw base image
    ctx.drawImage(template, 0, 0, width, height);

    // Set text properties
    ctx.font = 'bold 48px Sans';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    // Draw Name
    ctx.fillText(name, width / 2, height * 0.55); // Adjust Y as needed

    // Draw Course
    ctx.font = '36px Sans';
    ctx.fillText(course, width / 2, height * 0.65); // Adjust Y as needed

    // Save to file
    return canvas.toBuffer('image/png');
}

export const getCertificate = async (courseId) => {
    const certificateId = await getCertificateId(courseId);
    if (!certificateId) {
        return {
            success: false,
            message: "Certificate not found"
        }

    }
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