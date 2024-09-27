import React from 'react'
import {
    Box, Text,
    HStack,
    Image,
    Flex,
    Button,
    Divider,
    Center
} from '@chakra-ui/react'
import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    Spinner,
    StepStatus,
    Stepper,
    useSteps,
} from '@chakra-ui/react'
import { CiDeliveryTruck } from "react-icons/ci";
import Invoice from '../../assets/icons/invoice.svg'
import Visa from '../../assets/icons/visa.svg'
import OtherApi from '../../apis/other.api';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { formatDate } from '@fullcalendar/core/index.js';
import { formatTime } from '../../utils/common.util';
function Index() {


    return (
        <Box pos={'relative'}>
            {/* <ProductBanner BannerImage={BannerImg} Heading={'Order-History'} Breadcrumb={'Home Order-History'} /> */}
            <HStack
                flexDir={{ base: "column", lg: "row" }}
                w={{ base: "98%", lg: "95%" }}
                m={"auto"}
            >
                {/* <ProfileSideBarComponent /> */}
                <Box alignSelf={'start'}
                    w={{ base: "100%", md: "100%" }}
                    h={{ base: "100%", md: 'fit-content' }}
                    mt={4}
                    rounded={'md'}
                >
                    <Box w={'100%'} mb={10} pb={2} overflow={{ base: "scroll", md: "unset" }} bg={'white'} borderRadius={'10px'} border={'1px solid #cccccc'}>
                        <MainTable />
                    </Box>
                </Box>

            </HStack>

        </Box>
    )
}

export default Index
const MainTable = () => {
    const [data, setData] = useState([])
    let dates = (data?.trackingData?.deliveryStatusDates);

    const steps = [
        { title: 'Pending', description: dates?.pending },
        { title: 'Order Confirmed', description: dates?.confirmed },
        { title: 'Shipped', description: dates?.shipped },
        { title: 'Out For Delivery', description: dates?.outOfDelivery },
        { title: 'Delivered', description: dates?.delivered },
    ];

    const statusToIndex = {
        pending: 1,
        confirmed: 2,
        shipped: 3,
        outOfDelivery: 4,
        delivered: 5,
    };

    const initialStepIndex = statusToIndex[data?.trackingData?.deliverystatus];
    console.log(data?.trackingData?.deliverystatus);

    const { activeStep, setActiveStep } = useSteps({
        index: initialStepIndex,
        count: steps.length,
    });
    console.log(activeStep);

    useEffect(() => {
        setActiveStep(statusToIndex[data?.trackingData?.deliverystatus] || 0);
    }, [dates, setActiveStep]);

    const [loading, setLoading] = useState(false)
    const max = steps.length - 1
    const progressPercent = (activeStep / max) * 100
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const orderId = searchParams.get('orderId');
    const trackingApi = new OtherApi()
    const getStatusSummary = async () => {
        setLoading(true);
        try {
            const response = await trackingApi.trackOrder({
                orderId
            });
            if (response.data.code === 200 && response.data.status === 'success') {
                setData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStatusSummary()
    }, []);

    return (
        <Box p={4}>
            {
                loading ? <>
                    <HStack
                        w="100%"
                        h="90vh"
                        justifyContent="center"
                        alignItems="center"
                        justify="center"
                    >
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="#2b8f65"
                            size="xl"
                        />
                    </HStack>
                </> :
                    <Box>
                        <HStack justifyContent={'space-between'}>
                            <Text fontWeight={'700'} fontSize={{ base: "18px", md: "30px" }} textColor={'#344054'}>
                                Order ID: {data?.orderId}
                            </Text>
                            <Button colorScheme='' variant={'outline'}><Image mr={2} src={Invoice} /> Invoice</Button>
                        </HStack>

                        <HStack>
                            <Text textColor={'#667085'} fontSize={{ base: "12px", md: "14px" }} fontWeight={700}>
                                Order date:
                                <Text textColor={'#1D2939'} fontWeight={'16px'} as={'span'}>   {`${formatDate(data.createdAt)} ${formatTime(data.createdAt)}`}</Text>
                            </Text>
                            <Center height='20px'>
                                <Divider orientation='vertical' />
                            </Center>
                            <HStack mt={2} textColor={'#667085'} fontSize={{ base: "12px", md: "14px" }} fontWeight={700}>
                                <CiDeliveryTruck fontSize={'20px'} />
                                <Text textColor={'#12B76A'} fontWeight={'16px'} as={'span'}>Estimated delivery: {dates?.delivered}</Text>
                            </HStack>
                        </HStack>
                        <Divider my={8} border={'0.5px solid black'} />
                        <Box display={'flex'} flexDir={'column'} gap={2} alignSelf={'start'} w={{ base: "100%", lg: "100%" }}>
                            <Box p={2} rounded={'md'} border={'1px solid #DEDEDE'} w={'100%'}>
                                <Box justifyContent={'space-between'} w={'100%'} flexDir={{ base: "column", md: "row" }} display={{ base: "flex", md: "flex" }} p={4}>
                                    <Box w={{ base: "100%", md: "50%" }}>
                                        <Stepper h={{ base: "400px", md: "500px" }} orientation={'vertical'} index={activeStep}>
                                            {steps.map((step, index) => (
                                                <Step key={index}>
                                                    <StepIndicator>
                                                        <StepStatus
                                                            complete={<StepIcon />}
                                                            incomplete={<StepNumber />}
                                                            active={<StepNumber />}
                                                        />
                                                    </StepIndicator>
                                                    <Box flexShrink='0'>
                                                        <Text textColor={'#12B76A'}>{step.title}</Text>
                                                        <StepDescription>{step.description}</StepDescription>
                                                    </Box>
                                                    <StepSeparator className='bg' />
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                    <HStack w={{ base: "100%", md: "30%" }} flexDirection={'column'} alignItems={'start'} alignContent={'start'} mb={4}>
                                        {
                                            data?.items?.map((item, index) => {
                                                return (
                                                    <HStack key={index} mt={4} justifyContent={'space-between'} w={'100%'}>
                                                        <HStack>
                                                            <Box bg={'white'} overflow={'hidden'} borderRadius={'8px'} border={'2px solid #cccccc'}>
                                                                {/* <Image w={{ base: "60px", md: "80px" }} src={item?.coverImage} alt='img' /> */}
                                                                <Image w={{ base: "40px", md: "80px" }} h={'20'} src={item?.coverImage} alt='img' />

                                                            </Box>
                                                            <Box>
                                                                <Text textColor={'#344054'} fontFamily={'Inter'} noOfLines={2} fontSize={{ base: "14px", md: "14px" }} fontWeight={400}>{item?.name}</Text>
                                                                <Text textColor={'#344054'} fontSize={{ base: "12px", md: "12px" }} fontWeight={500}>Quantity:{item?.quantity}</Text>
                                                            </Box>
                                                        </HStack>
                                                        <Box>
                                                            <Box>
                                                                <Text textColor={'#1D2939'} fontSize={{ base: "14px", md: "20px" }} fontWeight={700}>$
                                                                    {/* {item?.originalPrice*item?.quantity}  */}
                                                                    {!item?.reducedPrice ? item?.reducedPrice * item?.quantity : item?.reducedPrice}

                                                                </Text>
                                                                {/* <Text textColor={'#344054'} fontSize={{ base: "12px", md: "14px" }} fontWeight={500}>Size: {'asdf'}</Text> */}
                                                            </Box>
                                                        </Box>
                                                    </HStack>
                                                )
                                            })
                                        }
                                    </HStack>
                                </Box>
                            </Box>
                        </Box>
                        <HStack justify={'space-between'}>
                            <Box></Box>
                            {(!data?.address || Object.keys(data?.address).length > 0) ? (
                                <Box w={{ base: "100%", md: "40%" }}>
                                    <Text textColor={'#000000'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={700}>
                                        Delivery
                                    </Text>
                                    <Text mr={4} fontSize={'14px'}>Address</Text>
                                    <Text textColor={'#667085'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={400}>
                                        {data?.address?.firstName}{' '}
                                        {data?.address?.lastName}{', '}
                                        {data?.address?.contact}{' '}
                                        <Box display={{ base: "", lg: "inline-block" }} as='br' />
                                        {data?.address?.street}{', '}
                                        {data?.address?.city}{', '}
                                        {data?.address?.state}{', '}
                                        {data?.address?.country}{', '}
                                        {data?.address?.zipCode}{' '}
                                    </Text>
                                </Box>
                            ) : null}


                        </HStack>
                        <Divider my={8} border={'0.5px solid black'} />
                        <Flex placeContent={'end'}>
                            <Box w={{ base: "100%", md: "40%" }} >
                                <Text alignSelf={'start'} textColor={'#000000'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={500}>Order Summary</Text>
                                <HStack textColor={'#475467'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={400} justifyContent={'space-between'}>
                                    <Text>Total Items</Text>
                                    <Text>({data?.totalItems})</Text>
                                </HStack>
                                <HStack textColor={'#475467'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={400} justifyContent={'space-between'}>
                                    <Text>Coupon Discount</Text>
                                    <Text>$ {data?.discount}</Text>
                                </HStack>
                                <HStack textColor={'#475467'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={400} justifyContent={'space-between'}>
                                    <Text>Shipping</Text>
                                    <Text>$ {data?.shipping}</Text>
                                </HStack>

                                <HStack textColor={'#475467'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={400} justifyContent={'space-between'}>
                                    <Text>Tax</Text>
                                    <Text>$ {data?.tax}</Text>
                                </HStack>
                                <HStack textColor={'#475467'} fontSize={'20px'} fontFamily={'Inter'} fontWeight={800} justifyContent={'space-between'}>
                                    <Text>Total</Text>
                                    <Text>${data?.orderTotal}</Text>
                                </HStack>
                            </Box>
                        </Flex>
                    </Box>}
        </Box>

    )
}

