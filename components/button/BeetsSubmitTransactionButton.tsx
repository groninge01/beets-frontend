import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import React, { ReactNode, useEffect, useState } from 'react';
import { Button, LinkProps, VStack, Text, useConst } from '@chakra-ui/react';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { motion, useAnimation } from 'framer-motion';
import { omit } from 'lodash';

interface BeetsSubmitTransactionButtonProps extends Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'> {
    loadingText?: string;
    pendingText?: string;
    onClick: () => void;
    submittingText?: string;

    children: ReactNode | ReactNode[];
    onSubmitting?: () => void;
    onPending?: () => void;
    onCanceled?: () => void;
    onConfirmed?: () => void;

    fullWidth?: boolean;
}

export function BeetsSubmitTransactionButton({
    isDisabled,
    isLoading,
    isSubmitting,
    isPending,
    onClick,
    loadingText = 'Loading...',
    submittingText = 'Waiting for wallet confirmation...',
    pendingText = 'Waiting for transaction confirmation...',
    onSubmitting,
    onPending,
    onCanceled,
    onConfirmed,
    isSubmitError,
    isConfirmed,
    isFailed,
    reset,
    submitError,
    txResponse,
    txReceipt,
    children,
    fullWidth,
    ...rest
}: BeetsSubmitTransactionButtonProps & ButtonOptions & ButtonProps & LinkProps) {
    const controls = useAnimation();
    const [isAnimating, setIsAnimating] = useState(false);
    const isProcessing = isSubmitting || isPending || isLoading || false;

    useEffect(() => {
        if (isSubmitting && onSubmitting) {
            onSubmitting();
        }
    }, [isSubmitting]);

    useEffect(() => {
        if (isPending && onPending) {
            onPending();
        }
    }, [isPending]);

    useEffect(() => {
        if ((isSubmitError || isFailed) && onCanceled) {
            onCanceled();
        }
    }, [isSubmitError, isFailed]);

    useEffect(() => {
        if (isConfirmed && onConfirmed) {
            onConfirmed();
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (isProcessing && isProcessing !== undefined) {
            controls.set({
                minWidth: '50px',
            });
            controls.start({
                width: '50px',
                transition: { type: 'spring', bounce: 0, mass: 1, stiffness: 200, damping: 25 },
            });
            setIsAnimating(true);
        } else {
            if (isAnimating) {
                controls.start({
                    width: 'auto',
                    minWidth: '100%',
                    transition: { type: 'spring', bounce: 0, duration: 0.5 },
                });
                setIsAnimating(false);
            }
        }
    }, [isProcessing]);

    let _children = children;

    return (
        <VStack width={fullWidth ? 'full' : undefined}>
            {isProcessing && (
                <Text fontWeight="semibold" fontSize="1rem">
                    {isSubmitting ? submittingText : isPending ? pendingText : loadingText}
                </Text>
            )}
            <Button
                variant="primary"
                isDisabled={isDisabled || isLoading || isSubmitting || isPending}
                isLoading={isLoading || isSubmitting || isPending}
                onClick={onClick}
                _hover={{ transform: 'none', backgroundColor: isProcessing ? '' : 'beets.highlight' }}
                {...rest}
                as={motion.button}
                animate={controls}
            >
                {_children}
            </Button>
        </VStack>
    );
}
