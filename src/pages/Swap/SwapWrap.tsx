import * as S from './SwapPage.style';
import { ExchangeIcon } from 'assets';
import Swap from 'components/swap/Swap';
import { useSwapContext } from 'contexts/SwapProvider';
import { handleSwapBtnState } from 'utils/util';

import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from 'store/actions';
import { from_wei, setDeadline, testInput, to_wei } from 'utils/util';

import { ChangeEvent, useCallback, useState, useEffect } from 'react';
import { chainIds } from 'configs/services/chainIds';
import {
    useAccount,
    useNetwork,
    useSwitchNetwork,
    useBalance,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
} from 'wagmi';
import { MAP_STR_ABI } from 'configs/abis';
import { ABI, CHAINDS, CONTRACT_ADDRESSES, FUNCTION, Field } from '../../utils/enum';

import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { useWeb3Modal } from '@web3modal/react';
import { useToasts } from 'react-toast-notifications';
import { parseEther } from 'viem';
import { initialSwapSelect } from 'constants/select';
import { SwapListItemType } from 'types/select';


const SwapWrap = () => {
    const { address, isConnected } = useAccount();
    const { open } = useWeb3Modal();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [_input, setInput] = useState<string>("");
    const { input, output } = useSwapContext();
    const {
        data: amountOut,
        loading,
        error,
    } = useSelector((state: { data: string; loading: boolean; error: any }) => state);
    const [btnState, setBtnState] = useState<number>(1);
    const approvalAmount = '1000000';
    const [disabled, setDisabled] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [spotlightToken, setSpotlightToken] = useState<SwapListItemType>(initialSwapSelect);

    function inputHandler(e: ChangeEvent<HTMLInputElement>) {
        let typedValue = e.target.value;
        if (testInput(typedValue) || typedValue === '') {
            setInput(typedValue);
            handleDebouncedAmountOut(typedValue);
        }
    }

    const { data: approvalA, write: approveA } = useContractWrite({
        address: input?.address,
        abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
        args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
        functionName: 'approve',
        onSuccess(data) {
            console.log({ approvalA: data });
            setInput("");
            dispatch(
                fetchData({
                    amountIn: "",
                    tokenA: input?.address,
                    tokenB: output?.address,
                }) as any,
            );
            setLoader(true);
        },
        onError(err) {
            console.log({ approvalErrA: err });
            setLoader(false);
        },
    });

    const handleDebouncedAmountOut = useCallback(
        debounce((value: string) => {
            dispatch(
                fetchData({
                    amountIn: to_wei(value),
                    tokenA: input?.address,
                    tokenB: output?.address,
                }) as any,
            );
        }, 500), // 500ms debounce delay
        [_input, input?.address, output?.address],
    );

    const { chain } = useNetwork();

    const { chains, switchNetwork } = useSwitchNetwork({
        onSuccess(data) {
            console.log({ data });
        },
    });

    const { data: swapTxData, write: swap } = useContractWrite({
        address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        functionName: FUNCTION.SWAPEXACTTOKENSFORTOKENS,
        onSuccess() {
            setInput("");
            dispatch(
                fetchData({
                    amountIn: "",
                    tokenA: input?.address,
                    tokenB: output?.address,
                }) as any,
            );
        },

        onError(err) {
            console.log({ approvalErrB: err });
        },
    });

    const { data: swapWLCTxData, write: swapWLC } = useContractWrite({
        address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        functionName: FUNCTION.SWAPEXACTETHFORTOKENS,
        value: parseEther(_input),
        onSuccess() {
            setInput("");
            dispatch(
                fetchData({
                    amountIn: "",
                    tokenA: input?.address,
                    tokenB: output?.address,
                }) as any,
            );
        },

        onError(err) {
            console.log({ approvalErrB: err });
        },
    });

    async function handleSwap() {
        let deadline = await setDeadline(3600);
        const swapPath = [input.address, output.address];
        if (input.address === MAPNETTOADDRESS[CONTRACT_ADDRESSES.WWLC_ADDRESS]) {
            swapWLC({ args: [to_wei("0.0001"), swapPath, address, deadline] });
        } else {
            swap({ args: [to_wei(_input), amountOut, swapPath, address, deadline] });
        }
        // setModal(true)
    }

    useWaitForTransaction({
        hash: swapTxData?.hash || swapWLCTxData?.hash,
        staleTime: 2_000,
        onSuccess(data) {
            console.log('Swap confirmation success: ', data);
            setLoader(false);
            addToast('Swap confirmation success', {
                appearance: 'success', // 오류 메시지 스타일
                autoDismiss: true, // 자동 닫기
            });
            // setModal(false)
        },

        onError(err) {
            console.log('Error: ', err);
            setLoader(false);
            addToast('Swap confirmation failure', {
                appearance: 'error', // 오류 메시지 스타일
                autoDismiss: true, // 자동 닫기
            });
            // setModal(false)
        },
    });

    useWaitForTransaction({
        hash: approvalA?.hash,
        staleTime: 2_000,
        onSuccess(data) {
            console.log('Approve confirmation success: ', data);
            setLoader(false);
            addToast('Approve confirmation success', {
                appearance: 'success', // 오류 메시지 스타일
                autoDismiss: true, // 자동 닫기
            });
        },
        onError(err) {
            console.log('Error: ', err);
            setLoader(false);
            addToast('Approve confirmation failure', {
                appearance: 'error', // 오류 메시지 스타일
                autoDismiss: true, // 자동 닫기
            });
        },
    });

    const { data: tokenBalanceA } = useContractRead({
        address: input.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'balanceOf',
        args: [address],
        watch: true,
        onSuccess(data: any) {
            console.log({ tokenBalanceA: data });
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    const { data: tokenBalanceB } = useContractRead({
        address: output.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'balanceOf',
        args: [address],
        watch: true,
        onSuccess(data: any) {
            console.log({ tokenBalanceB: data });
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    const { data: allowanceA } = useContractRead({
        address: input.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'allowance',
        args: [address, MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER]],
        watch: true,
        onSuccess(data: any) {
            console.log({ allowanceA: data });
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    function handleFunctionSelector() {
        if (!isConnected) {
            // metamask is not connected
            open();
            return;
        } else if (chain?.id !== chainIds[CHAINDS.WORLDLAND]) {
            // wrong network
            switchNetwork?.(chainIds[CHAINDS.WORLDLAND]);
        } else if (_input === '0' || _input === '') {
            // empty field
            return;
        } else if (Number(from_wei(tokenBalanceA)) < Number(_input ? _input : '0')) {
            // balance A is not enough
            return;
        } else if (Number(_input ? _input : '0') > Number(from_wei(allowanceA))) {
            // if allowanceA is low
            approveA();
        } else {
            // permission to add liquidity
            handleSwap();
        }
    }

    useEffect(() => {
        if (!isConnected) {
            // metamask is not connected
            setDisabled(false);
            setBtnState(4);
        } else if (chain?.id !== chainIds[CHAINDS.WORLDLAND]) {
            // wrong network
            setDisabled(false);
            setBtnState(7);
        } else if (_input === '0' || _input === '') {
            // empty field
            setDisabled(true);
            setBtnState(5);
            setSpotlightToken(input);
        } else if (Number(from_wei(tokenBalanceA)) < Number(_input ? _input : '0')) {
            // balance A is not enough
            setDisabled(true);
            setBtnState(1);
            setSpotlightToken(input);
        } else if (Number(_input ? _input : '0') > Number(from_wei(allowanceA))) {
            // checks the lv-router02 contract's allowance on user's token input and decides if the contract needs an approval of user on their tokens
            setDisabled(false);
            setBtnState(2);
        } else {
            // permission to swap
            setBtnState(6);
            setDisabled(false);
        }
    }, [
        chain?.id,
        _input,
        input,
        allowanceA,
        amountOut,
        isConnected,
        tokenBalanceA,
        tokenBalanceB,
    ]);


    return (
        <S.SwapWrapper>
            <Swap type="input" text="From" listType="tokenList" input={_input} eventHandler={inputHandler} />
            <ExchangeIcon />
            <Swap type="output" text="To" listType="tokenList" output={amountOut} />
            <S.Button disabled={disabled} onClick={handleFunctionSelector} type="button">{handleSwapBtnState(btnState, spotlightToken)}</S.Button>
        </S.SwapWrapper>
    );
};

export default SwapWrap;
