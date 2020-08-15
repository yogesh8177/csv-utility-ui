import React from 'react';
import {toast} from 'react-toastify';

export default function NotificationItem(props) {
    const {item, detectNotificationChange} = props;

    function handleDownloadClick(item) {
        toast.info(`Downloading: ${item.key}`,{
            position: toast.POSITION.TOP_CENTER
        });
    }

    function handleDismiss(item) {
        detectNotificationChange(item, 'remove');
    }

    return <li className="notification-item" key={item.jobid}>
            Job <strong>{item.jobid}</strong> complete. <button className="download-btn" onClick={(e) => handleDownloadClick(item)}>Download</button>
            <button className="dismiss-btn" onClick={(e) => handleDismiss(item)}>Dismiss</button>
           </li>
}