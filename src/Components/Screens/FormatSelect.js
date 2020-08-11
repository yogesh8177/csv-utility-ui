import React, {useState} from 'react';

export default function FormatSelect(props) {
    const [format, setFormat] = useState('');
    const {onFormatChange, currentScreenIndex, screenIndex} = props;
    
    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    function handleFormatChange(e) {
        console.log('setting format', e.target.value);
        setFormat(e.target.value);
        onFormatChange(e);
    }

    return (
        <>
            <div>
                <label>Output format</label><br/>
                <select defaultValue={format} onChange={handleFormatChange} name='Format' className='ui-select'>
                    <option value=''>Select</option>
                    <option value='csv'>CSV</option>
                    <option value='json'>JSON</option>
                </select>
            </div>
        </>
    );
}