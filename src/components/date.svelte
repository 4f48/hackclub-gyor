<script lang="ts">
    import { DateField, type WithoutChildrenOrChild } from "bits-ui";

    type Props = WithoutChildrenOrChild<DateField.RootProps> & {
        id: string;
        name: string;
    };
    const { id, name, ...props }: Props = $props();
</script>

<DateField.Root locale="hu" {...props}>
    <div class="grid focus-within:text-[#00ff00] mb-4">
        <DateField.Label>{name}</DateField.Label>
        <DateField.Input class="p-1 border">
            {#snippet children({ segments })}
                {#each segments as { part, value }}
                    <DateField.Segment
                        class="focus-visible:outline-none focus-visible:bg-[#00ff00] focus-visible:text-black"
                        {part}>{value}</DateField.Segment
                    >
                {/each}
            {/snippet}
        </DateField.Input>
    </div>
</DateField.Root>
