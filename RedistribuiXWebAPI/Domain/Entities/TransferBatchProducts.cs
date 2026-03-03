namespace Domain.Entities
{
    public class TransferBatchProducts
    {
        public Guid TransferBatchProductsId { get; set; }
        public Guid TransferBatchId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }


        public TransferBatch TransferBatch { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
