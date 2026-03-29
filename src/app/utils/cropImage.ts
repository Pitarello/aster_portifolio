export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // extracted cropped image
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // Resize if too large
  const MAX_WIDTH = 800;
  const MAX_HEIGHT = 800;
  let finalWidth = canvas.width;
  let finalHeight = canvas.height;

  if (finalWidth > MAX_WIDTH || finalHeight > MAX_HEIGHT) {
    if (finalWidth > finalHeight) {
      finalHeight = Math.round((finalHeight * MAX_WIDTH) / finalWidth);
      finalWidth = MAX_WIDTH;
    } else {
      finalWidth = Math.round((finalWidth * MAX_HEIGHT) / finalHeight);
      finalHeight = MAX_HEIGHT;
    }
    
    const resizeCanvas = document.createElement('canvas');
    resizeCanvas.width = finalWidth;
    resizeCanvas.height = finalHeight;
    const resizeCtx = resizeCanvas.getContext('2d');
    if (resizeCtx) {
      resizeCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight);
      return resizeCanvas.toDataURL('image/jpeg', 0.8);
    }
  }

  // As Base64 string
  return canvas.toDataURL('image/jpeg', 0.8); // 0.8 for some compression
}
