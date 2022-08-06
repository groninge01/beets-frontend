import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { useQuery } from 'react-query';
import { AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';

export function usePoolJoinGetProportionalSuggestionForFixedAmount() {
    const { poolService } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts);
    const { selectedInvestTokens } = useInvest();

    return useQuery(
        [{ key: 'joinGetProportionalSuggestionForFixedAmount', tokenAmountsIn }],
        async ({ queryKey }) => {
            const fixedAmount = tokenAmountsIn[0];

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(
                fixedAmount,
                selectedInvestTokens.map((token) => token.address),
            );
            const proportionalSuggestion = Object.fromEntries(result.map((item) => [item.address, item.amount]));

            return isProportionalSuggestionValid(inputAmounts, proportionalSuggestion) ? proportionalSuggestion : {};
        },
        { enabled: tokenAmountsIn.length > 0, staleTime: 0, cacheTime: 0 },
    );
}

function isProportionalSuggestionValid(
    inputAmounts: AmountHumanReadableMap,
    proportionalAmounts: AmountHumanReadableMap,
) {
    if (Object.keys(proportionalAmounts).length === 0) {
        //there is no proportional suggestion
        return true;
    }

    const addresses = Object.keys(inputAmounts);

    for (const address of addresses) {
        if (inputAmounts[address] !== '' && inputAmounts[address] !== proportionalAmounts[address]) {
            return false;
        }
    }

    return true;
}
