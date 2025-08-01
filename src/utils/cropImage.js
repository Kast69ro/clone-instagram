
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Не удалось загрузить изображение'));
    image.src = url;
  });
}



export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flipHorizontal = false,
  flipVertical = false,
  outputType = 'image/png'
) {
  const image = await createImage(imageSrc);

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const rotatedWidth = Math.ceil(image.width * cos + image.height * sin);
  const rotatedHeight = Math.ceil(image.width * sin + image.height * cos);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = rotatedWidth;
  tempCanvas.height = rotatedHeight;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.save();
  tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
  tempCtx.rotate(radians);
  tempCtx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);
  tempCtx.restore();


  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    tempCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );


  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      },
      outputType,
      outputType === 'image/jpeg' ? 0.95 : undefined
    );
  });
}
