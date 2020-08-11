import React, {useState} from 'react';

export default function MappingFields(props) {
    const [mapping, setMapping]                   = useState('');
    const [sequence, setSequence]                 = useState('');
    const [headers, setHeaders]                   = useState([]);
    const [outputHeaders, setOutputHeaders]       = useState([]);
    const [referenceHeaders, setReferenceHeaders] = useState([]);

    const {onMappingChange, onSequenceChange, onFileChange, currentScreenIndex, screenIndex} = props;

    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    function readFileHeaders(e) {
        let files = e.target.files;
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('file onload: ', e.target.result.split(/\r?\n/)[0]);
            let csvHeaders = e.target.result.split(/\r?\n/)[0];
            console.log({csvHeaders});
            setHeaders(csvHeaders.split(','));
            setReferenceHeaders(csvHeaders.split(','));
            setOutputHeaders(csvHeaders.split(','));
            setSequence(csvHeaders);
            onSequenceChange({target: {value: csvHeaders}});
        };
        reader.readAsText(files[0]);
        onFileChange(e);
    }

    function handleMappingChange(e) {
        setMapping(e.target.value);
        onMappingChange(e);
    }

    function handleSequenceChange(e) {
        setSequence(e.target.value);
        onSequenceChange(e);
    }

    function confirmMapping(modifiedOutputHeaders, originalHeaders) {
        let _mappings = ``;
        let _sequence = ``;
        let _outputHeaders = [];

        let totalModifiedHeaders = modifiedOutputHeaders.length;
        modifiedOutputHeaders.forEach((oHeader, index) => {
            let headerMapping = document.getElementById(oHeader).value;
            _mappings += `${originalHeaders[index]}:${headerMapping}`;
            _sequence += `${headerMapping}`;
            if ((totalModifiedHeaders - 1) !== index) {
                _mappings += ',';
                _sequence += ',';
            }
            _outputHeaders.push(headerMapping);
        });
        // set header mappings
        setMapping(_mappings);
        onMappingChange({target: {value: _mappings}});
        console.log({_sequence});
        // set header sequence
        setSequence(_sequence);
        onSequenceChange({target: {value: _sequence}});
        //set output headers
        setOutputHeaders(_outputHeaders);
    }

    function removeUnwantedHeader(data) {
        const {mappingHeaders, originalHeaders, header, index} = data;
        let modifiedOutputHeaders   = mappingHeaders.filter(h => h !== header);
        originalHeaders.splice(index, 1);
        let modifiedOriginalHeaders = [].concat(originalHeaders);

        setOutputHeaders(modifiedOutputHeaders);
        setHeaders(modifiedOriginalHeaders);
        
        setSequence(modifiedOutputHeaders);
        onSequenceChange({target: {value: modifiedOutputHeaders}});
    }

    function addHeaderToMappings(data) {
        const {headers, outputHeaders, header, index} = data;
        if (headers.includes(header)) return;
        outputHeaders.splice(index, 0, header);
        headers.splice(index, 0, header);

        let modifiedOutputHeaders = [].concat(outputHeaders);
        let modifiedOriginalHeaders = [].concat(headers);

        setHeaders(modifiedOriginalHeaders);
        setOutputHeaders(modifiedOutputHeaders);
    }

    function Headers(props) {
        const {referenceHeaders} = props;
        let spans = referenceHeaders.map((header, index) => <span key={header}>{header} <button onClick={(e) => addHeaderToMappings({headers, outputHeaders, header, index})}>Add</button> </span>);
        return spans;
    }

    function Mappings(props) {
        const {mappingHeaders, originalHeaders} = props;
        let list = mappingHeaders.map((header, index) => <li key={originalHeaders[index]}>{originalHeaders[index]} <input type='text' name={originalHeaders[index]} defaultValue={header} id={header} /> <button onClick={(e) => removeUnwantedHeader({ mappingHeaders, originalHeaders, header, index})}>Remove</button></li>);
        //let list = mappingHeaders.map((header, index) => <li key={originalHeaders[index]}>{originalHeaders[index]} <input type='text' name={originalHeaders[index]} defaultValue={header} id={header} /></li>);
        return list;
    }

    return (
        <>
            <ul className='ui-list'>
                <li>File <br/><input type='file' onChange={readFileHeaders} name='file' id='file' accept='.csv' /></li>
                <li>
                    <label>Headers (Select file to detect and map headers) </label><br/>
                    <ul>
                        <Headers referenceHeaders={referenceHeaders} />
                    </ul>
                </li>
                <li>
                    <label>Mappings (Select different header names that you want in your transformed file.) </label><br/>
                    <ul>
                        <Mappings mappingHeaders={outputHeaders} originalHeaders={headers}/>
                    </ul>
                </li>
                <li><button onClick={(e) => confirmMapping(outputHeaders, headers)}>Confirm Mapping</button></li>
                <li><label>Mapping (Header mapping with original vs output headers) </label><br/> <input type='text' onChange={handleMappingChange} name='mapping' id='Mapping' placeholder='mapping' value={mapping} /></li>
                <li><label>Sequence (Header sequence for final output file) </label><br/> <input type='text' onChange={handleSequenceChange} name='sequence' id='Sequence' placeholder='sequence' value={sequence} /></li>
            </ul>
           
        </>
    );
}