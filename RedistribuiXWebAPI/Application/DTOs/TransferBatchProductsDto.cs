namespace Application.DTOs
{
    public class TransferBatchProductsDto
    {
        public Guid TransferBatchProductsId { get; set; }
        public Guid TransferBatchId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
