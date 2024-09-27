import React, { useState, useEffect } from 'react';
import {
    Box, Text, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button
} from '@chakra-ui/react';
import { MainSubHeading } from '../../components/shared/custom design/Index';
import { ChevronLeftIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import Auth from '../../apis/auth/auth.api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function VerifyCode() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authApi = new Auth()
    const navigate = useNavigate()
    const [passwordError, setPasswordError] = useState('');
    const [resendEnabled, setResendEnabled] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const validatePassword = () => {
        const isValid = password.length >= 8;
        setPasswordError(isValid ? '' : 'Verification code must be at least 8 characters long');
        return isValid;
    };

    const handleClick = () => setShow(!show);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validatePassword()) {
            setLoading(true);
            try {
                const VerifyCodeResponse = await authApi.verifyOTP({
                    otp: password,
                    email
                });
                if (VerifyCodeResponse.data.code === 200) {
                    navigate('/setnew-password');
                    toast.success(VerifyCodeResponse.data.message);
                } else {
                    toast.error(VerifyCodeResponse.data.message);

                }
            } catch (error) {
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        setEmail(localStorage.getItem('isEmail'));
    }, []);
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendEnabled(true);
        }
    }, [countdown]);

    return (
        <Box px={2} pt={28} h={'80vh'} w={{ base: '100%', md: '500px' }} m={'auto'}>
            <Link to={'/login'}>
                <Box mb={3} textColor={'#313131'} fontSize={'14px'}>
                    <ChevronLeftIcon fontSize={'24px'} />
                    Back to login
                </Box>
            </Link>
            <MainSubHeading textAlign="start">
                Verify code
            </MainSubHeading>
            <MainSubHeading textAlign="start" fontSize="16px" textColor="#313131">
                An authentication code has been sent to your email.
            </MainSubHeading>
            <form onSubmit={handleSubmit}>
                <FormControl mt={4} isRequired>
                    <FormLabel>Enter Code</FormLabel>
                    <InputGroup>
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={show ? 'text' : 'password'}
                            placeholder="*********"
                            onBlur={validatePassword}
                            border="1px solid #79747E"
                            focusBorderColor="none"
                            bg="white"
                            color="black"
                            outline="none"
                        />
                        <InputRightElement cursor={'pointer'} onClick={handleClick} pr={4}>
                            {show ? <ViewOffIcon /> : <ViewIcon />}
                        </InputRightElement>
                    </InputGroup>
                    <Text mt={1} fontSize="sm" color="red.500">
                        {passwordError}
                    </Text>
                </FormControl>
                <Button
                    mt={4}
                    mb={4}
                    w="100%"
                    colorScheme=""
                    isLoading={loading}
                    className="Bg"
                    variant="solid"
                    rounded="sm"
                    type="submit"
                >
                    Submit
                </Button>
                <MainSubHeading textAlign='start' fontSize='14px'>
                    {resendEnabled ? " Didn’t receive a code?" : "Resend OTP"}
                    <Link to={'/forgot-password/?id=resendotp'}>
                        <Button w={'fit-content'} ml={-4} isDisabled={!resendEnabled} variant={'outline'} colorScheme='' border={'none'}>
                            <Text ml={2} cursor={'pointer'} as={'span'} textColor={'#FF8682'}> {resendEnabled ? "Resend" : <>{
                                countdown} second </>} </Text>
                        </Button>
                    </Link>
                </MainSubHeading>
            </form>
        </Box>
    );
}

export default VerifyCode;
