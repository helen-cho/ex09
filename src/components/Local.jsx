import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Paging.css'
import Pagination from 'react-js-pagination';
import {app} from '../firebase'
import {getDatabase, ref, set} from 'firebase/database'

const Local = () => {
    const db = getDatabase(app);
    const [page, setPage] = useState(1);
    const [form, setForm] = useState({
        city: '인천',
        menu: '중식'
    });

    const cities = ['인천', '서울', '경기도', '부산'];
    const menus = ['중식', '일식', '한식', '분식', '프랭크버거'];

    const [documents, setDocuments] = useState(null);
    const [total, setTotal] = useState(0);
    const [query, setQuery] = useState('인천 중식');

    const callAPI = async() => {
        const url='https://dapi.kakao.com/v2/local/search/keyword.json';
        const config={
            headers: {'Authorization': 'KakaoAK b80880fbde422de3fd9b4a4e67c9bb54'},
            params: {query: query, page:page, size:5}
        }
        const result=await axios(url, config);
        console.log(result.data);
        setDocuments(result.data.documents);
        setTotal(result.data.meta.pageable_count);
    }

    useEffect(()=>{
        callAPI();
    }, [query, page]);

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        setPage(1);
        setQuery(form.city + " " + form.menu);
    }

    const onFavorite = (e, doc) => {
        e.preventDefault();
        if(!window.confirm('즐겨찾기에 추가하실래요?')) return;
        //console.log(doc);
        //즐겨찾기추가
        const email=sessionStorage.getItem('email').replace('.','');
        set(ref(db, `favorite/${email}/${doc.id}`), doc);
        alert("즐겨찾기등록!");
    }

    if(documents === null) return <h1>로딩중.....</h1>
    return (
        <div>
            <h1>맛집검색</h1>
            <form onSubmit={onSubmit}>
                <select onChange={onChange} name="city">
                    {cities.map(city=>
                        <option key={city}>{city}</option>
                    )}
                </select>
                <select onChange={onChange} name="menu">
                   {menus.map(menu=>
                        <option key={menu}>{menu}</option>
                    )}
                </select>
                <button>검색</button>
                <span>검색수: {total}건</span>
            </form>
            <hr/>
            <table>
                <thead>
                    <tr>
                        <td>ID.</td>
                        <td>음식점명</td>
                        <td>주소</td>
                        <td>전화번호</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {documents.map(doc=>
                        <tr key={doc.id}>
                            <td>{doc.id}</td>
                            <td>{doc.place_name}</td>
                            <td>{doc.address_name}</td>
                            <td>{doc.phone}</td>
                            <td>
                                {sessionStorage.getItem('email') && 
                                    <a href="#" title='즐겨찾기' 
                                        onClick={(e)=>onFavorite(e, doc)}>★</a>
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <hr/>
            <Pagination
                activePage={page}
                itemsCountPerPage={5}
                totalItemsCount={total}
                pageRangeDisplayed={10}
                prevPageText={"◀"}
                nextPageText={"▶"}
                onChange={ (e)=>setPage(e) }/>
        </div>
    )
}

export default Local