import React from 'react';
import {toast} from 'react-toastify';

export default function NotificationItem(props) {
    const {item, detectNotificationChange} = props;

    async function handleDownloadClick(item) {
        try {
            const {bucket, key} = item;
            toast.info(`Downloading file, please wait...`,{
                position: toast.POSITION.TOP_CENTER
            });
            const payload = {
                bucketData: {
                    Bucket: bucket,
                    Key: key
                }
            };
            let response = await fetch(
                'https://05e9fny512.execute-api.us-east-1.amazonaws.com/test/GenerateSignedUrl',{
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            let signedUrl = await response.json();
            if (response.ok) {
                window.open(signedUrl.url, '_blank');
            }
            else {
                console.error(`Error while receiving signed url from lambda`);
                toast.error(`Error occurred while downloading file!`);
            }
        }
        catch(error) {
            console.error(error);
            toast.error('Network Error!');
        }
    }

    function handleDismiss(item) {
        detectNotificationChange(item, 'remove');
    }

    return <li className="notification-item" key={item.jobid}>
            Job <strong>{item.jobid}</strong> complete. <button className="download-btn" onClick={(e) => handleDownloadClick(item)}>Download</button>
            <button className="dismiss-btn" onClick={(e) => handleDismiss(item)}>Dismiss</button>
           </li>
}