import React, { useEffect, useState } from 'react'
import {app} from '../firebase'
import {getDatabase, ref, onValue, remove} from 'firebase/database'
import LocalMap from './LocalMap';
const Favorite = () => {
    const [doc, setDoc] = useState(null);
    const [documents, setDocuments] = useState(null);
    const db = getDatabase(app);
    const email=sessionStorage.getItem('email').replace('.','');

    const callAPI = () => {
        onValue(ref(db, `favorite/${email}`),(snapshot)=>{
            let rows=[];
            snapshot.forEach(row=>{
                rows.push(row.val());
            });
            console.log(rows);
            setDocuments(rows);
        })
    }

    const onDelete = (e, id) => {
        e.preventDefault();
        if(!window.confirm(`${id}번을 삭제하실래요?`)) return;
        //삭제
        remove(ref(db, `favorite/${email}/${id}`));
    }

    useEffect(()=>{
        callAPI();
    },[]);

    const onClickMap = (e, doc) => {
        e.preventDefault();
        setDoc(doc)
    }

    if(documents == null) return <h1>로딩중......</h1>
    return (
      <div>
          <h1>즐겨찾기</h1>
          <table>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>장소명</td>
                    <td>주소</td>
                    <td>전화번호</td>
                </tr>
            </thead>
            <tbody>
                {documents.map(doc=>
                    <tr key={doc.id}>
                        <td>
                            {doc.id}&nbsp;&nbsp;
                            <a href="#" onClick={(e)=>onDelete(e, doc.id)}>🗑</a>
                        </td>
                        <td>{doc.place_name}</td>
                        <td>
                            {doc.address_name}
                            <a href="#" onClick={(e)=>onClickMap(e, doc)}>위치</a>
                        </td>
                        <td>{doc.phone}</td>
                    </tr>
                )}
            </tbody>
          </table>
          <hr/>
          {doc !==null && <LocalMap local={doc}/> }
      </div>
    )
}

export default Favorite