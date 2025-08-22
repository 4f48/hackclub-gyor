<script lang="ts">
    import { today } from "@internationalized/date";
    import { DateField, type WithoutChildrenOrChild } from "bits-ui";
</script>

<DateField.Root locale="hu" required>
    <div class="grid focus-within:text-[#00ff00] mb-4">
        <DateField.Label>Születésnap</DateField.Label>
        <DateField.Input class="p-1 border" id="birthday" name="birthday">
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
