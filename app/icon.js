import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 64,
	height: 64,
};
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex"
				}}>
				<svg className={"w-full h-full"} xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M9.05,3.24c-1.73,2.92-4.96,10.81-4.03,19M11.65,3.24c2.93,1.29,7.75,4.97,3.6,9.35-5.19,5.47-6.91,5.2-7.92,2.6-1.01-2.6,28.23,6.9,12.96,11.65-15.27,4.76-14.54.86-14.54-.86M28.2,1.66v22.44M54.25,3.24c-6.2-2.88-26.79,10.36-13.39,19,13.39,8.64,13.39,3.75,13.39-.86,0-3.69-1.92-6.62-2.88-7.62l-6.33,1.44,14.11-4.18" fill="none" stroke="#0500ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.74"/><path d="M11.61,35.52c-.88,4.37-1.49,8.07-1.89,11.19M9.72,46.71c-1.47,11.42-.15,15.07.94,15.35l-.94-15.35ZM9.72,46.71c2.02-3.14,7.29-9.27,12.25-8.62M9.72,46.71c3.5,4.66,11.3,13.88,14.54,13.46" fill="none" stroke="#0500ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.74"/><path d="M28.7,33.91c2.69,8.94,4.54,22.66,5.12,28.41M41.1,35.8c-1.44,5.16-4.04,16.59-2.97,21,4.9,4.18,14.93,10.02,15.9,0,1.21-12.53,2.14-16.43-4.59-19.66-5.38-2.59-10.42-3.6-12.27-3.78" fill="none" stroke="#0500ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.74"/><rect width="64" height="64" fill="none" stroke-width="0"/></svg>
			</div>
		),
		{
			...size,
		}
	);
}
