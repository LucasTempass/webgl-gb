export function loadImage(
  src: string,
  onLoad: (image: HTMLImageElement) => void,
) {
  const image = new Image();
  image.src = src;

  image.onload = () => {
    console.log("Loaded image: ", image);
    onLoad(image);
  };

  image.onerror = (e) => {
    console.error("Error loading image: ", e);
  };
}
