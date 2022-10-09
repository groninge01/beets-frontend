import { Box, HStack, StackDivider, Text, VStack } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount, tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestActions } from '~/modules/pool/invest/components/PoolInvestActions';
import { CardRow } from '~/components/card/CardRow';
import TokenRow from '~/components/token/TokenRow';
import React from 'react';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function PoolInvestPreview({ onInvestComplete, onClose }: Props) {
    const { priceForAmount } = useGetTokens();
    const { selectedInvestTokensWithAmounts } = useInvest();

    return (
        <Box p="4">
            <PoolInvestSummary mt="6" />
            <BeetsBox>
                <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />} mt="4" p="2">
                    {selectedInvestTokensWithAmounts.map((token, index) => {
                        return <TokenRow key={token.address} address={token.address} amount={token.amount} />;
                    })}
                </VStack>
            </BeetsBox>
            <PoolInvestActions onInvestComplete={onInvestComplete} onClose={onClose} />
        </Box>
    );
}
