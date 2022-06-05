import { Box, Container, Flex } from '@chakra-ui/react';

import Head from 'next/head';
import PoolComposition from '~/modules/pool/detail/components/PoolComposition';
import { PoolDetailActions } from '~/modules/pool/detail/components/PoolDetailActions';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import { PoolDetailMyBalance } from '~/modules/pool/detail/components/PoolDetailMyBalance';
import { PoolDetailMyRewards } from '~/modules/pool/detail/components/PoolDetailMyRewards';
import { PoolDetailTransactions } from '~/modules/pool/detail/components/PoolDetailTransactions';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { useGetTokens } from '~/lib/global/useToken';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { useProvider } from 'wagmi';

function PoolDetail() {
    const { pool } = usePool();
    const { isLoading, hasBpt } = usePoolUserPoolTokenBalances();

    const { tokens } = useGetTokens();
    const provider = useProvider();

    useAsyncEffect(async () => {
        await masterChefService.getPendingRewards({
            userAddress: '0x4fbe899d37fb7514adf2f41B0630E018Ec275a0C',
            farms: pool.staking?.farm ? [pool.staking.farm] : [],
            tokens,
            provider,
        });
    }, []);

    return (
        <>
            <Head>
                <title>{pool.name}</title>
                <meta property="og:title" content={pool.name} />
                <meta property="og:description" content={pool.name} />
                <meta
                    property="og:image"
                    content={`https://beets-frontend-groninge.vercel.app/images/og/${pool.id}.jpg`}
                />
                <meta
                    property="twitter:image"
                    content={`https://beets-frontend-groninge.vercel.app/images/og/${pool.id}.jpg`}
                />
            </Head>
            <Container maxW="full">
                <Flex mb={8}>
                    <Box flex={1}>
                        <PoolHeader />
                    </Box>
                </Flex>
                <Flex mb={12}>
                    <Box flex={2}>
                        <PoolDetailChart mb={8} />
                        <PoolComposition pool={pool} />
                        <PoolDetailTransactions mt={8} />
                    </Box>
                    <Box flex={1} ml={8}>
                        {hasBpt || isLoading ? <PoolDetailMyBalance mb={8} /> : null}
                        {(hasBpt && pool.staking) || isLoading ? <PoolDetailMyRewards mb={8} /> : null}
                        <PoolDetailActions />
                    </Box>
                </Flex>
            </Container>
        </>
    );
}

export default PoolDetail;
