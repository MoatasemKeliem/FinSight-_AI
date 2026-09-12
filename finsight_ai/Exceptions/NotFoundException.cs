using System;

namespace finsight_ai.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }

}
