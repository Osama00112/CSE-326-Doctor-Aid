import styles from './LoginForm.module.scss';
import {Form, Image, Button, Container, Spinner} from "react-bootstrap";
import React, {useContext, useRef, useState} from "react";
import {useRouter} from "next/router";
import {BiMailSend} from "react-icons/bi";
import AuthContext from "../../store/auth-context";
import {LoginData} from "../../models/LoginData";

const server = 'http://localhost:3000';

const emailValidity = (inp: string): boolean => inp.trim() !== '';
const passwordValidity = (inp: string): boolean => inp.trim() !== '';

const LoginForm = () => {

    const authCtx = useContext(AuthContext);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputIdRef = useRef<HTMLInputElement | null>(null);
    const inputPasswordRef = useRef<HTMLInputElement | null>(null);
    const [formValid, setFormValid] = useState(true);

    const router = useRouter();

    const loginDataHandler = async (data: LoginData) => {
        const time = new Date(new Date().getTime() + (300000 * 1000));
        authCtx.login(data.personInfo.personId.toString(), time.toISOString(), data);
        await router.push(`/login`);
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = inputIdRef.current?.value;
        const password = inputPasswordRef.current?.value;

        if (!email || !password || !emailValidity(email) || !passwordValidity(password)) {
            setFormValid(false);
            return;
        }

        setFormValid(true);
        setIsSubmitting(true);

        fetch(`${server}/user/login`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(resp => {
            if(resp.status !== 200) throw new Error();
            return resp.json();
        }).then(data => {
            loginDataHandler(data);
        }).catch(_ => {
            setFormValid(false);
        }).finally(async () => {
            setIsSubmitting(false);
        });
    }

    return (
        <Form className={styles.content} onSubmit={submitHandler}>
            <div className={styles['form-header']}>
                <h3>Login Form</h3>
            </div>
            <div className={`${styles.id}`}>
                <Form.Floating className="mb-4 mt-5">
                    <Form.Control
                        id="floatingInputCustom"
                        type="text"
                        placeholder="email"
                        ref={inputIdRef}
                    />
                    <label htmlFor="floatingInputCustom">
                        <big><BiMailSend/>&nbsp;&nbsp;</big>
                        E-Mail
                    </label>
                </Form.Floating>
            </div>
            <Form.Floating className="mb-4">
                <Form.Control
                    id="floatingPasswordCustom"
                    type="password"
                    placeholder="Password"
                    ref={inputPasswordRef}
                />
                <label htmlFor="floatingPasswordCustom">
                    <Image src='/password-icon.png' width={20} height={20} alt='id' className={styles.passImg}/>
                    Password
                </label>
            </Form.Floating>

            {!formValid &&
                <p className={styles['error-text']}>Server processing failed!! Check inputs</p>}

            <Container className='d-flex'>
                <Button className={`${styles.button} mb-4`} variant="info" size="lg" type='submit'>
                    Submit
                </Button>
                {isSubmitting && <Spinner animation="border" variant="danger"/>}
            </Container>
        </Form>
    );
}

export default LoginForm;