import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { useSlippage } from '~/lib/global/useSlippage';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function usePoolExitGetContractCallData() {
    const { userAddress } = useUserAccount();
    const { type, singleAsset, proportionalPercent } = useReactiveVar(withdrawStateVar);
    const { poolService, pool } = usePool();
    const { userTotalBptBalance, userWalletBptBalance } = usePoolUserBptBalance();
    const { data: proportionalAmountsOut, error, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const { data: singleAssetWithdrawEstimate } = usePoolExitGetBptInForSingleAssetWithdraw();
    const { slippage } = useSlippage();

    return useQuery(
        [
            'exitGetContractCallData',
            pool.id,
            type,
            singleAsset,
            proportionalPercent,
            proportionalAmountsOut,
            singleAssetWithdrawEstimate,
            slippage,
        ],
        () => {
            if (type === 'PROPORTIONAL' && proportionalAmountsOut) {
                const userBptRatio = oldBnumToHumanReadable(
                    oldBnumScaleAmount(userWalletBptBalance).times(proportionalPercent / 100),
                );

                return poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForTokensOut',
                    amountsOut: proportionalAmountsOut,
                    bptAmountIn: userBptRatio,
                    slippage,
                    userAddress: userAddress || '',
                });
            } else if (
                type === 'SINGLE_ASSET' &&
                singleAsset &&
                singleAssetWithdrawEstimate &&
                singleAsset.amount !== ''
            ) {
                return poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForOneTokenOut',
                    bptAmountIn: singleAssetWithdrawEstimate.bptIn,
                    tokenOutAddress: singleAsset.address,
                    userBptBalance: userTotalBptBalance,
                    slippage,
                    amountOut: singleAsset.amount,
                    userAddress: userAddress || '',
                });
            }

            return null;
        },
        {},
    );
}
