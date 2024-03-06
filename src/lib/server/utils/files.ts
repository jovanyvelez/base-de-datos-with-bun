export const urlToFIle = (url: string) => {
	const arr = url.split(',');
	const mime: string | null = arr[0].match(/:(.*?);/)?.[1] || null;

	const data = arr[1];
	const dataStr = atob(data);
	let n = dataStr.length;
	const dataArr = new Uint8Array(n);
	while (n--) {
		dataArr[n] = dataStr.charCodeAt(n);
	}

	//let file = new File([dataArr], 'File.jpg', {type: mime})
	const file = new File([dataArr], 'File.jpg', { type: mime as string | undefined });

	return file;
};