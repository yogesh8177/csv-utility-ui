import React from 'react';
import NotificationItem from './NotificationItem';

export default function NotificationContainer(props) {
    const {notifications, handleNotificationChange} = props;

    /**
     * 
     * @param {*} item notification item to modify
     * @param {*} operation Presently only remove operation is supported by default.
     * Need to add code to handle any new operations that may be added in future
     */
    function detectNotificationChange(item, operation) {
        let indexToRemove = null;
        let notificationToModify = [...notifications];
        notificationToModify.forEach((notif, index) => {
            if (notif.jobid === item.jobid)  indexToRemove = index;
        }); 
        notificationToModify.splice(indexToRemove, 1);
        localStorage.setItem('notifications', JSON.stringify(notificationToModify));
        handleNotificationChange(notificationToModify);
    }

    let notificationItems = notifications.map(item => {
        return <NotificationItem item={item} key={item.jobid} detectNotificationChange={detectNotificationChange} />
    });

    return (
        <ul className="notification-container">
            {notificationItems}
        </ul>
    );
}