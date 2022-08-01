import { Alert, AlertIcon, Box, Button, Link, Spinner } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BatchSwapSorRoute } from '~/components/batch-swap/BatchSwapSorRoute';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { CardRow } from '~/components/card/CardRow';
import { addressShortDisplayName } from '~/lib/util/address';
import {
    etherscanGetAddressUrl,
    etherscanGetBlockUrl,
    etherscanGetTxUrl,
    etherscanTxShortenForDisplay,
} from '~/lib/util/etherscan';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { FadeInBox } from '~/components/animation/FadeInBox';

interface Props {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'>;
}

export function TradeSubmittedContent({ query }: Props) {
    const { reactiveTradeState } = useTrade();
    const { isConfirmed, isFailed, isPending, error, txReceipt, txResponse } = query;

    console.log({ isConfirmed, isFailed, isPending, error, txReceipt, txResponse });

    return (
        <Box pt="4">
            {reactiveTradeState.sorResponse && <BatchSwapSorRoute swapInfo={reactiveTradeState.sorResponse} />}
            <BeetsBox width="full" p="2" mt="4">
                <CardRow>
                    <Box flex="1">Status</Box>
                    <Box color={isFailed ? 'beets.red' : isConfirmed ? 'beets.green' : 'orange'}>
                        {isPending && <Spinner size="sm" mr="2" />}
                        {isFailed ? 'Failed' : isConfirmed ? 'Confirmed' : isPending ? 'Pending' : 'Unknown'}
                    </Box>
                </CardRow>
                {txResponse?.hash && (
                    <CardRow>
                        <Box flex="1">Transaction hash</Box>
                        <Box>
                            <Link href={etherscanGetTxUrl(txResponse.hash)} target="_blank">
                                {etherscanTxShortenForDisplay(txResponse.hash)}
                            </Link>
                        </Box>
                    </CardRow>
                )}
                {txResponse?.to && (
                    <CardRow>
                        <Box flex="1">Contract</Box>
                        <Box>
                            <Link href={etherscanGetAddressUrl(txResponse.to)} target="_blank">
                                {addressShortDisplayName(txResponse.to)}
                            </Link>
                        </Box>
                    </CardRow>
                )}
                {txReceipt?.blockNumber && (
                    <CardRow mb="0">
                        <Box flex="1">Block number</Box>
                        <Box>
                            <Link href={etherscanGetBlockUrl(txReceipt.blockNumber)} target="_blank">
                                {txReceipt.blockNumber}
                            </Link>
                        </Box>
                    </CardRow>
                )}
                {error ? (
                    <Alert status="error" mt={4}>
                        <AlertIcon />
                        An error occurred: {error.message}
                    </Alert>
                ) : null}
            </BeetsBox>
            <FadeInBox isVisible={query.isConfirmed}>
                <Alert status="success" borderRadius="md" mt="4">
                    <AlertIcon />
                    Your swap was successfully executed
                </Alert>
            </FadeInBox>
        </Box>
    );
}
