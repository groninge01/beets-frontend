import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { BeetsAccordion } from '~/components/accordion/BeetsAccordion';
import PoolWithdrawForm from '~/modules/pool/withdraw/components/PoolWithdrawForm';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolWithdrawUnstakeForm } from '~/modules/pool/withdraw/components/PoolWithdrawUnstakeForm';

export function PoolWithdrawActions() {
    const { pool } = usePool();
    const { hasBptStaked } = usePoolUserPoolTokenBalances();
    let items = [{ headline: 'Withdraw from pool', content: <PoolWithdrawForm />, disabled: false }];

    if (pool.staking) {
        items = [{ headline: 'Unstake BPT', content: <PoolWithdrawUnstakeForm />, disabled: !hasBptStaked }, ...items];
    }

    return <BeetsAccordion flex="1" mx="8" defaultIndex={hasBptStaked ? 0 : 1} items={items} />;
}