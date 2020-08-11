import React, {useState} from 'react';

export default function ActionType(props) {
    const [action, setAction] = useState('');

    const {onActionChange, currentScreenIndex, screenIndex} = props;
    
    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    function handleActionChange(e) {
        console.log('setting operation', e.target.value);
        setAction(e.target.value);
        onActionChange(e);
    }

    return (
        <>
            <div>
                <label>Action</label><br/>
                <select defaultValue={action} onChange={handleActionChange} name='Operation' className='ui-select'>
                    <option value=''>Select</option>
                    <option value='transform'>Transform</option>
                </select>
            </div>
        </>
    );
}