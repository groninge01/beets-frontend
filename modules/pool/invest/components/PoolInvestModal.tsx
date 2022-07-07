import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '@chakra-ui/modal';
import {
    ModalOverlay,
    useBoolean,
    HStack,
    Box,
    Heading,
    VStack,
    Text,
    Flex,
    SliderTrack,
    SliderThumb,
    SliderFilledTrack,
    Slider,
    Circle,
} from '@chakra-ui/react';
import numeral from 'numeral';
import BeetsButton from '~/components/button/Button';
import Card from '~/components/card/Card';
import TokenInput from '~/components/inputs/TokenInput';
import { PoolInvestFormTokenInput } from '~/modules/pool/invest/components/PoolInvestFormTokenInput';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { usePoolJoinGetProportionalSuggestionForFixedAmount } from '~/modules/pool/invest/lib/usePoolJoinGetProportionalSuggestionForFixedAmount';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';

interface Props {}

export default function PoolInvestModal(props: Props) {
    const [isVisible, setIsVisible] = useBoolean();
    const { pool } = usePool();
    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { inputAmounts, setInputAmount } = useInvestState();
    const { joinPool, isSubmitting, submitError } = useJoinPool(pool);
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts);
    const { data: proportionalAmounts } = usePoolJoinGetProportionalSuggestionForFixedAmount();
    const { data: bptOutAndPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { data: contractCallData } = usePoolJoinGetContractCallData(bptOutAndPriceImpact?.minBptReceived || null);

    return (
        <>
            <BeetsButton onClick={() => setIsVisible.on()}>Add liquidity</BeetsButton>
            <Modal isOpen={isVisible} onClose={() => setIsVisible.off()} size="3xl">
                <ModalOverlay />
                <ModalContent backgroundColor="black">
                    <ModalCloseButton />
                    <ModalBody className="bg" padding="0">
                        <HStack height="600px" padding="4" width="full" backgroundColor="whiteAlpha.100">
                            <Flex width="50%">
                                <VStack width="full" alignItems="flex-start">
                                    <VStack spacing="none" alignItems="flex-start">
                                        <Heading size="md">You want to invest</Heading>
                                        <Text fontSize="2em">{numeral('0.00').format('$0,0.00a')}</Text>
                                    </VStack>
                                    <VStack width="full">
                                        {pool.investConfig.options.map((option, index) => (
                                            <PoolInvestFormTokenInput
                                                key={index}
                                                userBalances={userPoolTokenBalances}
                                                option={option}
                                                setInputAmount={(address, amount) => {
                                                    setInputAmount(address, amount);
                                                }}
                                                value={inputAmounts[option.poolTokenAddress]}
                                                proportionalAmount={
                                                    proportionalAmounts
                                                        ? proportionalAmounts[option.poolTokenAddress]
                                                        : ''
                                                }
                                                //mb={4}
                                                //p={0}
                                            />
                                        ))}
                                    </VStack>
                                    <BeetsButton isFullWidth>Invest</BeetsButton>
                                </VStack>
                            </Flex>
                            <Flex height="full" width="50%" rounded="lg" backgroundColor="whiteAlpha.300"></Flex>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
