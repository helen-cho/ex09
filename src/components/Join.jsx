import React, {useState} from 'react'
import {app} from '../firebase'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

const Join = ({history}) => {
    const auth = getAuth(app);
    const [form, setForm] = useState({
        email:'user10@email.com',
        password: '12341234'
    });
    const {email, password} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(!window.confirm('회원을 가입하실래요?')) return;
        //회원가입
        createUserWithEmailAndPassword(auth, email, password)
        .then((success)=>{
            alert("회원가입성공!");
            history.push('/login');
        })
        .catch((error)=>{
            alert("회원가입실패!");
        })
    }

    return (
        <div className='login'>
        <h1>회원가입</h1>
        <form onSubmit={onSubmit}>
            <input name="email" value={email} onChange={onChange}/>
            <input name="password" value={password} onChange={onChange} type="password"/>
            <button>회원가입</button>
        </form>
    </div>
    )
}

export default Join